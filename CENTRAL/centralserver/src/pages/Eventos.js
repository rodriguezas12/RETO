import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import "./Eventos.css";

function Eventos() {
  const [data, setData] = useState([]);
  const [kit_armado, setKitArmado] = useState(0);
  const [ensamblados, setEnsablados] = useState(0);
  const [selectedStation, setSelectedStation] = useState("");
  // Simulación de datos de estaciones
  const stations = [
    "Estación 1",
    "Estación 2",
    "Estación 3",
    "Estación 4",
    "Estación 5",
    "Estación 6",
    "Estación 7",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/contabilidad-kits");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        let totalKits = 0;
        data.forEach((row) => {
          totalKits += row.Cantidad; // Suponiendo que la segunda columna sea la cantidad de kits
        });
        setKitArmado(totalKits);
        setEnsablados(Math.floor(totalKits / 2)); // Cada 2 kits armados aumenta 1 ensamblado
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      if (selectedStation) {
        // Sustituir espacio por '_' para coincidir con el nombre de la tabla
        const stationNumber = selectedStation.split(" ")[1];

        // Realizar la consulta a la tabla correspondiente para la estación seleccionada
        try {
          const response = await fetch(
            `http://localhost:5000/estaciones/${stationNumber}`
          );
          if (!response.ok) {
            throw new Error(
              `Network response for Estacion_${stationNumber} was not ok`
            );
          }
          const stationData = await response.json();
          // Formatear la fecha de ingreso antes de calcular el tiempo transcurrido
          const formattedStationData = stationData.map((item) => ({
            ...item,
            fechaIngreso: formatDateTime(item.Hora_entrada),
            TiempoTranscurrido: calculateElapsedTime(item.Hora_entrada),
          }));

          // Agregar registros de consola para verificar el formato de las fechas después del formateo
          console.log("Datos con formato de fecha:", formattedStationData);

          setData(formattedStationData);
        } catch (error) {
          console.error(
            `Error fetching data for Estacion_${stationNumber}:`,
            error
          );
        }
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 1000);

    function formatDateTime(dateTimeString) {
      const dateObj = new Date(dateTimeString);
      const formattedDate = dateObj.toLocaleString(); // Convierte el objeto Date a una cadena en formato legible
      return formattedDate;
    }

    const calculateElapsedTime = (startTime) => {
      const startDate = new Date(startTime).getTime(); // Convertir la fecha de inicio a milisegundos
      const currentDate = new Date().getTime(); // Obtener la fecha actual en milisegundos

      const elapsedTime = currentDate - startDate; // Calcular el tiempo transcurrido en milisegundos
      const elapsedMinutes = Math.floor(elapsedTime / (1000 * 60)); // Convertir milisegundos a minutos
      const elapsedSeconds = Math.floor((elapsedTime % (1000 * 60)) / 1000); // Calcular los segundos restantes

      return `${elapsedMinutes} minutos ${elapsedSeconds} segundos`; // Devolver el tiempo transcurrido en minutos y segundos
    };

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
      <Header titulo="CONSULTA DE EVENTOS" />
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
          <span className="elemento-label">
            Seleccione la estación de interés:
          </span>
          <select
            className="elemento-valor"
            value={selectedStation}
            onChange={(e) => setSelectedStation(e.target.value)}
          >
            <option value="">Seleccionar</option>
            {stations.map((station, index) => (
              <option key={index} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="container-conteo">
        <table className="estado">
          <thead>
            <tr>
              <th className="estado">ID</th>
              <th className="estado">KIT</th>
              <th className="estado">Hora de entrada a la estación</th>
              <th className="estado">Tiempo Transcurrido</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="estado">{item.ID}</td>
                <td className="estado">{item.Kit}</td>
                <td className="estado">{item.fechaIngreso}</td>{" "}
                {/* Utiliza item.fechaIngreso */}
                <td className="estado">{item.TiempoTranscurrido}</td>{" "}
                {/* Verifica que TiempoTranscurrido tenga datos */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="container-estado">
        <span className="subtitle">REGISTRO DE KITS ARMADOS EN ESTACIÓN:</span>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>KIT</th>
              <th>Hora de entrada a la estación</th>
              <th>Tiempo Transcurrido</th>
              <th>Hora de salida de la estación</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.ID}</td>
                <td>{item.Kit}</td>
                <td>{item.Hora_entrada}</td>
                <td>{item.Tiempo_transcurrido}</td>
                <td>{item.Hora_salida}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Eventos;
