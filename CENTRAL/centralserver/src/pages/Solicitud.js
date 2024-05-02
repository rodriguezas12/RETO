import React, { useEffect, useState } from "react";
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
    const cantidadDisponible = kitCounts[nombreKit];
    const cantidadEnPedido = pedido.filter((item) => item === kitNumero).length;

    if (cantidadEnPedido < cantidadDisponible) {
      const nuevoPedido = [...pedido, kitNumero];
      setPedido(nuevoPedido);
      setKitCounts((prevCounts) => ({
        ...prevCounts,
        [nombreKit]: prevCounts[nombreKit] - 1,
      }));
      alert(
        `Kit ${kitNumero} añadido al carrito.\nPedido actual: ${nuevoPedido.join(
          ", "
        )}`
      );
    } else {
      alert(`No hay suficientes kits disponibles de Kit ${kitNumero}.`);
    }
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
      alert(
        `Kit ${kitNumero} eliminado del carrito.\nPedido actual: ${nuevoPedido.join(
          ", "
        )}`
      );
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
      <Header titulo= "SOLICITUD DE MATERIALES"/>
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
