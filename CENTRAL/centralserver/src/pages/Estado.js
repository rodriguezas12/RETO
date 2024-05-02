import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import "./Estado.css";

function Estado() {
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
      <Header titulo="ESTADO DE PRODUCCIÓN" />
      <div className="container-conteo">
  <div className="contenedor-label1">
    <span className="elemento-label">Kits Armados:</span>
    <span className="elemento-valor">10</span>
  </div>
  <div className="contenedor-label2">
    <span className="elemento-label">Productos Ensamblados:</span>
    <span className="elemento-valor">20</span>
  </div>
</div>


      <div className="container-estado">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>KIT</th>
              <th>Hora de entrada a la estación</th>
              <th>Tiempo Transcurrido</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.ID}</td>
                <td>{item.KIT}</td>
                <td>{item.Hora_entrada_Estación}</td>
                <td>{item.Tiempo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Estado;
