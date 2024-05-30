import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from '../components/header';
import "./Inventario.css";

function Inventario() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5000/michi")
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se pudo obtener la respuesta del servidor");
          }
          return response.json();
        })
        .then((data) => {
          setData(data);
        })
        .catch((error) => console.error("Error:", error));
    };

    // Realizar la primera llamada para obtener los datos iniciales
    fetchData();

    // Establecer un intervalo para realizar la consulta cada segundo
    const intervalId = setInterval(fetchData, 1000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
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
              <th>Hora de entrada al laboratorio</th>
              <th>Hora de entrada a bodega</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.ID}</td>
                <td>{item.Nombre}</td>
                <td>{item.Hora_entrada_lab}</td>
                <td>{item.Hora_entrada_bodega}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventario;
