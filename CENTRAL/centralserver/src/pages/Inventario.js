import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import "./Inventario.css";

function Inventario() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/michi")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="INVENTARIO" />
      <div className="container-inventario">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Bahia</th>
              <th>Cantidad</th>
              <th>Hora de entrada al laboratorio</th>
              <th>Hora de salida del laboratorio</th>
              <th>Hora de entrada a bodega</th>
              <th>Hora de salida de bodega</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.ID}</td>
                <td>{item.Nombre}</td>
                <td>{item.Bahia}</td>
                <td>{item.Cantidad}</td>
                <td>{item.Hora_entrada_lab}</td>
                <td>{item.Hora_salida_lab}</td>
                <td>{item.Hora_entrada_bodega}</td>
                <td>{item.Hora_salida_bodega}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventario;
