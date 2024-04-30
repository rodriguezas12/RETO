import React, { useState } from "react";
import logo from '../Media/logo.png';

export default function Inventario() {
  // Inicializar el estado con un array de 3x10
  const [celdas, setCeldas] = useState(
    Array(3).fill(null).map(() => Array(10).fill(''))
  );

  // Manejador para actualizar el estado cuando el input cambia
  const handleInputChange = (rowIndex, columnIndex, value) => {
    const updatedCeldas = [...celdas];
    updatedCeldas[rowIndex][columnIndex] = value;
    setCeldas(updatedCeldas);
  };

  // Esqueleto de la función para manejar el envío de los datos
  const handleSubmit = () => {
    // Transforma el estado de las celdas en un formato adecuado para la base de datos
    const filasParaEnviar = celdas.map(row => ({
      'Col 1': row[0], 'Col 2': row[1], 'Col 3': row[2], 'Col 4': row[3], 'Col 5': row[4],
      'Col 6': row[5], 'Col 7': row[6], 'Col 8': row[7], 'Col 9': row[8], 'Col 10': row[9],
    }));
  
    // Envía cada fila de la matriz
    Promise.all(filasParaEnviar.map(fila => 
      fetch('http://localhost:5000/posicion', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fila)
      })
    ))
    .then(responses => Promise.all(responses.map(res => res.text())))
    .then(messages => {
      console.log('Todas las solicitudes fueron realizadas con éxito:', messages);
      // Limpiar el estado de las celdas una vez que se hayan enviado todos los datos
      setCeldas(Array(3).fill(null).map(() => Array(10).fill('')));
    })
    .catch(error => {
      console.error('Error al realizar la solicitud:', error);
    });
  };

  return (
    <>
      <header className="header">
      <button className="back-button" onClick={() =>
        window.location.href = '/Menu'}>Regresar al Menú</button>
        <img src={logo} alt="logo" className="logo" />
        <h1>INGRESO DE MATERIALES</h1>
      </header>
      <h1>En la siguiente tabla por favor asigne la posición de los kits que quiere colocar en el rack</h1>
      
      <table>
        <tbody>
          {celdas.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, columnIndex) => (
                <td key={columnIndex}>
                  <input
                    type="text"
                    value={cell}
                    onChange={(e) =>
                      handleInputChange(rowIndex, columnIndex, e.target.value)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="submit-container">
        <button onClick={handleSubmit}>Enviar</button>
      </div>
    </>
  );
}