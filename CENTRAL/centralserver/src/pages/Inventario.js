// App.js
import './Inventario.css';
import React, { useState, useEffect } from 'react';
//aqui se hace el llamado de los datos
function Inventario() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/tablaenpagina')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error:', error));
  }, []);
  //aqui empieza el diseño de la pagina y demas
  return (
    <div>
      {/* Contenedor del logo y el título */}
      <div className="intro-container">
        <div className="intro-box">
          <img src="../Media/logo.png" alt="Logo" className="logo" />
          <h1 className="title">Inventario</h1>
        </div>
      </div>

      <div className="container">
        <div className="header">
          <h1>Inventario</h1>
          {/* Coloca aquí tu logo */}
        </div>
        <div className="brown-container">
          {/* Contenido del contenedor marrón */}
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tags</th>
              <th>Bahia</th>
              <th>Kit</th>
              <th>INV</th>
              <th>Fecha de ingreso</th>
              <th>Fecha de ingreso al local</th>
              <th>Fecha de salida del local</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.ID}</td>
                <td>{item.tag}</td>
                <td>{item.bahia}</td>
                <td>{item.kit}</td>
                <td>{item.INV}</td>
                <td>{item.fechadeingreso}</td>
                <td>{item.fechadeingresoallocal}</td>
                <td>{item.fechadesalidadellocal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventario;