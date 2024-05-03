import React, { useState } from "react";
import Header from "../components/header";

export default function Inventario() {
  const [celdas, setCeldas] = useState(Array(3).fill(null).map(() => Array(10).fill("")));
  const [kitSeleccionado, setKitSeleccionado] = useState("");

  const handleCellClick = (rowIndex, columnIndex) => {
    if (!kitSeleccionado) return; // Evita marcar celdas si no se ha seleccionado un kit
    const updatedCeldas = [...celdas];
    updatedCeldas[rowIndex][columnIndex] = kitSeleccionado;
    setCeldas(updatedCeldas);
  };

  const handleSubmit = () => {
    // Transforma el estado de las celdas en un formato adecuado para la base de datos
    const filasParaEnviar = celdas.map((row) => ({
      "Col 1": row[0],
      "Col 2": row[1],
      "Col 3": row[2],
      "Col 4": row[3],
      "Col 5": row[4],
      "Col 6": row[5],
      "Col 7": row[6],
      "Col 8": row[7],
      "Col 9": row[8],
      "Col 10": row[9],
    }));

    // Envía cada fila de la matriz
    Promise.all(
      filasParaEnviar.map((fila) =>
        fetch("http://localhost:5000/posicion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fila),
        })
      )
    )
      .then((responses) => Promise.all(responses.map((res) => res.text())))
      .then((messages) => {
        console.log(
          "Todas las solicitudes fueron realizadas con éxito:",
          messages
        );
        // Limpiar el estado de las celdas una vez que se hayan enviado todos los datos
        setCeldas(
          Array(3)
            .fill(null)
            .map(() => Array(10).fill(""))
        );
      })
      .catch((error) => {
        console.error("Error al realizar la solicitud:", error);
      });
  };


  return (
    <>
      <Header titulo="INGRESO DE MATERIAL" />
      <p className="instructions">
        La siguiente tabla representa las bahías disponibles para establecer el orden del rack, por favor asignelo a su gusto.
      </p>
      <select value={kitSeleccionado} onChange={(e) => setKitSeleccionado(e.target.value)}>
        <option value="">Seleccione un Kit</option>
        <option value="1">Kit 1</option>
        <option value="2">Kit 2</option>
        <option value="3">Kit 3</option>
        <option value="4">Kit 4</option>
        <option value="5">Kit 5</option>
        <option value="6">Kit 6</option>
      </select>
      <div className="container-ingreso">
        <table>
          <tbody>
            {celdas.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, columnIndex) => (
                  <td key={columnIndex} onClick={() => handleCellClick(rowIndex, columnIndex)}>
                    {cell || "Vacío"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleSubmit}>Enviar</button>
      </div>
    </>
  );
}
