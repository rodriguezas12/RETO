import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import "./Eventos.css";

function Eventos() {
  const [data, setData] = useState([]);
  const [kit_armado, setKitArmado] = useState(0);
  const [ensamblados, setEnsablados] = useState(0);
  const [selectedStation, setSelectedStation] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    solicitudes: false,
    ingresoMaterial: false,
    kitsArmados: false,
  });

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
          totalKits += row.Cantidad;
        });
        setKitArmado(totalKits);
        setEnsablados(Math.floor(totalKits / 2));
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      if (selectedStation) {
        const stationNumber = selectedStation.split(" ")[1];

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
          const formattedStationData = stationData.map((item) => ({
            ...item,
            fechaIngreso: formatDateTime(item.Hora_entrada),
            TiempoTranscurrido: calculateElapsedTime(item.Hora_entrada),
          }));

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
      const formattedDate = dateObj.toLocaleString();
      return formattedDate;
    }

    const calculateElapsedTime = (startTime) => {
      const startDate = new Date(startTime).getTime();
      const currentDate = new Date().getTime();

      const elapsedTime = currentDate - startDate;
      const elapsedMinutes = Math.floor(elapsedTime / (1000 * 60));
      const elapsedSeconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

      return `${elapsedMinutes} minutos ${elapsedSeconds} segundos`;
    };

    return () => clearInterval(intervalId);
  }, [selectedStation]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: checked,
    }));
  };

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
      <div className="container-titulo">
      <h2 className="titulo-evento">Seleccione evento de interés</h2>
      </div>

      <div className="container-conteo">
        
        <div className="contenedor-label1">
          
        <label>
          <input
            type="checkbox"
            name="solicitudes"
            checked={checkboxes.solicitudes}
            onChange={handleCheckboxChange}
          />
          Solicitudes
        </label>
        </div>
        
        <div className="contenedor-label1">
        <label>
          <input
            type="checkbox"
            name="ingresoMaterial"
            checked={checkboxes.ingresoMaterial}
            onChange={handleCheckboxChange}
          />
          Ingreso Material
        </label>
        </div>

        <div className="contenedor-label1">
        <label>
          <input
            type="checkbox"
            name="kitsArmados"
            checked={checkboxes.kitsArmados}
            onChange={handleCheckboxChange}
          />
          Kits Armados
        </label>
        </div>
      </div>
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
                <td className="estado">{item.fechaIngreso}</td>
                <td className="estado">{item.TiempoTranscurrido}</td>
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
