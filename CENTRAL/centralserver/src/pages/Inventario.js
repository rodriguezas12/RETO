import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { tag: 'Tag1', kit: 'Kit1', bahia: 'Bahía1', tiempoIngreso: '09:00', tiempoAlmacen: '2 horas' },
        { tag: 'Tag2', kit: 'Kit2', bahia: 'Bahía2', tiempoIngreso: '10:00', tiempoAlmacen: '1 hora' },
        // Agrega más objetos de datos según sea necesario
      ]
    };
  }

  render() {
    return (
      <div>
        <h1>Tabla de inventario</h1>
        <table>
          <thead>
            <tr>
              <th>Tag</th>
              <th>Kit</th>
              <th>Bahía</th>
              <th>Tiempo de ingreso</th>
              <th>Tiempo en el almacén</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((item, index) => (
              <tr key={index}>
                <td>{item.tag}</td>
                <td>{item.kit}</td>
                <td>{item.bahia}</td>
                <td>{item.tiempoIngreso}</td>
                <td>{item.tiempoAlmacen}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}