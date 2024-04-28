// App.js
import './Inventario.css';
import React, { Component } from 'react';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
    // Realiza una solicitud a tu servidor backend para obtener los datos de la base de datos
    fetch('url_de_tu_backend')
      .then(response => response.json())
      .then(data => {
        this.setState({ data: data });
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }

  render() {
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
              {this.state.data.map((item, index) => (
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
}

export default App;