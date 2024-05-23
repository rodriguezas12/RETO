import React, { useState, useEffect } from "react";
import Header from "../components/header";

export default function Inventario() {
  const [celdas, setCeldas] = useState(Array(3).fill(null).map(() => Array(10).fill("")));
  const [kitSeleccionado, setKitSeleccionado] = useState("");
  const [data, setData] = useState([]);

  const loadData = () => {
    fetch("http://localhost:5000/said")
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error("Error al cargar los datos:", error));
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleCellClick = (rowIndex, columnIndex) => {
    if (!kitSeleccionado) return;
    const updatedCeldas = [...celdas];
    updatedCeldas[rowIndex][columnIndex] = kitSeleccionado;
    setCeldas(updatedCeldas);
  };

  const handleSubmit = async () => {
    const filasParaEnviar = celdas.map((row) => ({
      "Col1": row[0],
      "Col2": row[1],
      "Col3": row[2],
      "Col4": row[3],
      "Col5": row[4],
      "Col6": row[5],
      "Col7": row[6],
      "Col8": row[7],
      "Col9": row[8],
      "Col10": row[9],
    }));

    try {
      for (const fila of filasParaEnviar) {
        const response = await fetch("http://localhost:5000/posicion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(fila),
        });
        const message = await response.text();
        console.log("Respuesta de inserción:", message);
      }
      console.log("Todas las solicitudes fueron realizadas con éxito");
      setCeldas(Array(3).fill(null).map(() => Array(10).fill("")));
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  return (
    <>
      <Header titulo="INGRESO DE MATERIAL" />
      <div className="container-inventario">
        <table>
          <thead>
            <tr>
              {Array(10).fill(null).map((_, index) => (
                <th key={index}>Bahía {index * 3 + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {Array(10).fill(null).map((_, columnIndex) => (
                  <td key={columnIndex}>
                    Bahía {columnIndex * 3 + rowIndex + 1}: {item[`Col${columnIndex + 1}`] ? `Kit ${item[`Col${columnIndex + 1}`]}` : "Vacío"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="instructions">
        La siguiente tabla representa las bahías disponibles para establecer el nuevo orden del rack, por favor asignelo a su gusto.
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