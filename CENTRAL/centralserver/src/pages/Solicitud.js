import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import "./Solicitud.css";

export default function Picking() {
  const [kits, setKits] = useState([]);
  const [disponibles, setDisponibles] = useState({});
  const [carrito, setCarrito] = useState({});

  useEffect(() => {
    // Obtener los kits y su contenido
    fetch("http://localhost:5000/contenido_said")
      .then((response) => response.json())
      .then((data) => {
        setKits(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // Obtener la disponibilidad de kits
    fetch("http://localhost:5000/disponibilidad-kits")
      .then((response) => response.json())
      .then((data) => {
        setDisponibles(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const addToCart = (kitName) => {
    if (disponibles[kitName] > 0) {
      const kitNumber = parseInt(kitName.replace("Kit ", ""));
      const updatedCart = { ...carrito };
      updatedCart[kitNumber] = updatedCart[kitNumber] ? updatedCart[kitNumber] + 1 : 1;
      setCarrito(updatedCart);

      const updatedDisponibles = { ...disponibles };
      updatedDisponibles[kitName] -= 1;
      setDisponibles(updatedDisponibles);
    } else {
      alert(`No hay disponibilidad de ${kitName}`);
    }
  };

  const removeFromCart = (kitName) => {
    if (carrito[kitName] > 0) {
      const kitNumber = parseInt(kitName.replace("Kit ", ""));
      const updatedCart = { ...carrito };
      updatedCart[kitNumber] -= 1;
      setCarrito(updatedCart);

      const updatedDisponibles = { ...disponibles };
      updatedDisponibles[kitName] += 1;
      setDisponibles(updatedDisponibles);
    }
  };

  const enviarPedido = () => {
    const pedido = Object.keys(carrito).reduce((acc, kitName) => {
      const kitNumber = parseInt(kitName.replace("Kit ", ""));
      const count = carrito[kitName];
      for (let i = 0; i < count; i++) {
        acc.push(kitNumber);
      }
      return acc;
    }, []);
    
    fetch("http://localhost:5000/solicitar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nuevoPedido: pedido.join(",") }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data); // Mostrar mensaje de éxito o error
        // Limpiar el carrito después de enviar el pedido
        setCarrito({});
        // Restaurar disponibilidad inicial (opcional)
        setDisponibles({});
      })
      .catch((error) => {
        console.error("Error al enviar el pedido:", error);
        alert("Error al enviar el pedido");
      });
  };

  return (
    <div style={{ overflowY: "auto" }}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="SOLICITUD DE MATERIALES" />
      <div className="container-items">
        {kits.map((kit, index) => (
          <div
            key={kit.Kits}
            className={`kit-container ${
              disponibles[kit.Kits] === 0 ? "kit-container-white" : ""
            }`}
          >
            <h3>{kit.Kits}</h3>
            <p>{`Contenido: ${kit.Contenido}`}</p>
            <p>{`Disponibles: ${disponibles[kit.Kits] || 0}`}</p>
            <div>
              <button onClick={() => addToCart(kit.Kits)}>+</button>
              <span>{carrito[kit.Kits] || 0}</span>
              <button onClick={() => removeFromCart(kit.Kits)}>-</button>
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button onClick={enviarPedido}>Enviar</button>
      </div>
    </div>
  );
}
