import React, { useEffect, useState } from 'react';
import logo from "../Media/logo.png";

function Inventario() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/michi')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);

  const estilos = `
    .logo {
      height: 50px;
      width: auto;
      margin-right: 20px;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'ChauPhilomeneOne', sans-serif;
      padding: 10px 0;
    }

    .header-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `;

  return (
    <div>
      <style>{estilos}</style>
      <div className="container">
        <div className="brown-container">
          {/* Contenido adicional si es necesario */}
        </div>
        <div className="header">
          <div className="header-container">
            <img src={logo} alt="Logo" className="logo" />
            <h1>Inventario</h1>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Nombre</th>
              <th>INV</th>
              <th>Hora de entrada al laboratorio</th>
              <th>Hora de salida del laboratorio</th>
              <th>Hora de entrada a bodega</th>
              <th>Hora de salida de bodega</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.Tag}</td>
                <td>{item.Nombre}</td>
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