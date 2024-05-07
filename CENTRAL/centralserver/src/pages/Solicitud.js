import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import kit1 from "../Media/kit 1.png";
import kit2 from "../Media/kit 2.png";
import kit3 from "../Media/kit 3.png";
import kit4 from "../Media/kit 4.png";
import kit5 from "../Media/kit 5.png";
import kit6 from "../Media/kit 6.png";
import Header from "../components/header";
import "./Solicitud.css";

export default function Picking() {
  const [pedido, setPedido] = useState([]);
  const [kitCounts, setKitCounts] = useState({});

  useEffect(() => {
    fetch("http://localhost:5000/inventario_rack")
      .then((response) => response.json())
      .then((data) => {
        const counts = {};
        data.forEach((item) => {
          counts[item.Nombre] = item.Cantidad;
        });
        setKitCounts(counts);
      })
      .catch((error) =>
        console.error("Error al cargar los datos del inventario:", error)
      );
  }, []);

  const añadirKit = (kitNumero) => {
    const nombreKit = `Kit ${kitNumero}`;

    // Actualizar primero los contadores antes de modificar el pedido
    setKitCounts((prevCounts) => {
      if (prevCounts[nombreKit] > 0) {
        const newCounts = {
          ...prevCounts,
          [nombreKit]: prevCounts[nombreKit] - 1,
        };

        // Si hay disponibles, actualizar el pedido
        setPedido((prevPedido) => {
          const nuevoPedido = [...prevPedido, kitNumero];
          //alert(`Kit ${kitNumero} añadido al carrito.\nPedido actual: ${nuevoPedido.join(", ")}`);
          return nuevoPedido;
        });

        return newCounts;
      } else {
        //alert(`No hay suficientes kits disponibles de Kit ${kitNumero}.`);
        return prevCounts; // Retornar los contadores antiguos si no hay disponibles
      }
    });
  };

  const descontarKit = (kitNumero) => {
    const index = pedido.indexOf(kitNumero);
    if (index > -1) {
      const nuevoPedido = [...pedido];
      const nombreKit = `Kit ${kitNumero}`;
      nuevoPedido.splice(index, 1);
      setPedido(nuevoPedido);
      setKitCounts((prevCounts) => ({
        ...prevCounts,
        [nombreKit]: prevCounts[nombreKit] + 1,
      }));
      //alert(`Kit ${kitNumero} eliminado del carrito.\nPedido actual: ${nuevoPedido.join(", ")}`);
    }
  };

  const limpiarCarrito = () => {
    fetch("http://localhost:5000/inventario_rack")
      .then((response) => response.json())
      .then((data) => {
        const counts = {};
        data.forEach((item) => {
          counts[item.Nombre] = item.Cantidad;
        });
        setKitCounts(counts);
        setPedido([]);
        alert("Carrito limpiado");
      })
      .catch((error) =>
        console.error("Error al cargar los datos del inventario:", error)
      );
  };

  const solicitar = () => {
    if (pedido.length === 0) {
      alert("No hay kits en el carrito para solicitar.");
      return;
    }

    const data = {
      nuevoPedido: pedido.join(","),
    };

    fetch("http://localhost:5000/solicitar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((message) => {
        alert("Solicitud realizada con éxito: " + message);
        setPedido([]);
        limpiarCarrito(); // Restablece el carrito y los contadores después de una solicitud exitosa.
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
        alert("Error al realizar la solicitud: " + error.message);
      });
  };

  return (
    <div style={{ marginTop: "15vh" }}>
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
        {[kit1, kit2, kit3, kit4, kit5, kit6].map((image, index) => (
          <div key={index} className="Kit">
            <div className="info-product">
              <div className="info-text">
                <h2>Kit {index + 1}</h2>
                <p>Disponibles: {kitCounts[`Kit ${index + 1}`] || 0}</p>
              </div>
              <div className="button-container">
                <button className="button" onClick={() => añadirKit(index + 1)}>
                  +
                </button>
                <button
                  className="button"
                  onClick={() => descontarKit(index + 1)}
                >
                  -
                </button>
              </div>
            </div>
            <figure>
              <img
                src={image}
                alt={`Icono del Kit ${index + 1}`}
                className="icono"
              />
            </figure>
          </div>
        ))}
      </div>
      <div className="button-panel">
        <div>
          <span>
            Pedido actual: {pedido.map((num) => `Kit ${num}`).join(", ")}
          </span>
        </div>
        <button className="action-button" onClick={solicitar}>
          Solicitar
        </button>
        <button className="action-button" onClick={limpiarCarrito}>
          Limpiar carrito
        </button>
      </div>
    </div>
  );
}
