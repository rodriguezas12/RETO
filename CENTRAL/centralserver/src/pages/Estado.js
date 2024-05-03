import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import "./Estado.css";

function Estado() {
  const [data, setData] = useState([]);
  const [kit_armado, setKitArmado] = useState(0);
  const [ensamblados, setEnsablados] = useState(0);
  const [selectedStation, setSelectedStation] = useState("");
  // Simulación de datos de estaciones
  const stations = ["Estación 1", "Estación 2", "Estación 3", "Estación 4", "Estación 5", "Estación 6", "Estación 7"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/contabilidad-kits");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Calcula el total de kits armados y ensamblados
        let totalKits = 0;
        data.forEach((row) => {
          totalKits += row.Cantidad; // Suponiendo que la segunda columna sea la cantidad de kits
        });
        setKitArmado(totalKits);
        setEnsablados(Math.floor(totalKits / 2)); // Cada 2 kits armados aumenta 1 ensamblado
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      try {
        // Verificar si selectedStation tiene un valor válido
        if (!selectedStation) {
          console.error("No se ha seleccionado ninguna estación.");
          return;
        }
      
        // Construir el nombre de la tabla basado en la estación seleccionada
        const tableName = `Estacion_${selectedStation.split(" ")[1]}`;
      
        // Realizar la consulta a la tabla correspondiente para la estación seleccionada
        const response = await fetch(`http://localhost:5000/estaciones/${tableName}`);
        if (!response.ok) {
          throw new Error(`Network response for ${tableName} was not ok`);
        }
        const data = await response.json();
      
        // Establecer los datos obtenidos en el estado para mostrarlos en la tabla
        setData(data);
      } catch (error) {
        console.error(`Error fetching data for ${selectedStation}:`, error);
      }
  
      
    };
  
    // Ejecutar fetchData inicialmente y luego cada 5 segundos (5000 milisegundos)
    fetchData();
    const intervalId = setInterval(fetchData, 50000);
  
    // Limpiar el intervalo cuando el componente se desmonta
    return () => clearInterval(intervalId);
  }, [selectedStation]);
  

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
          <span className="elemento-valor">{kit_armado}</span>
        </div>
        <div className="contenedor-label1">
          <span className="elemento-label">Productos Ensamblados:</span>
          <span className="elemento-valor">{ensamblados}</span>
        </div>
        <div className="contenedor-label1">
        <span className="elemento-label">Seleccione la estación de interés:</span>
        <select className="elemento-valor" value={selectedStation} onChange={(e) => setSelectedStation(e.target.value)}>
            <option value="">Seleccionar</option>
            {stations.map((station, index) => (
              <option key={index} value={station}>{station}</option>
            ))}
          </select>
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
