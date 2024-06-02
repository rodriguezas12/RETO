import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Instructivo from "../Media/Instructivo.pdf"; // Importa el PDF
import { ReactComponent as IconPause } from "../Media/pause-solid.svg";
import { ReactComponent as IconPlay } from "../Media/play-solid.svg";
import { ReactComponent as IconStop } from "../Media/stop-solid.svg";
import Header from "../components/header";
import "./Estado.css";
function Estado() {
  const [data, setData] = useState([]);
  const [showButtons, setShowButtons] = useState(false); // Estado para controlar la visibilidad de los botones
  const [selectedStation, setSelectedStation] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [tiempoSet, setTiempoSet] = useState("00:00");
  const [intervalId, setIntervalId] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0); // Guarda el tiempo transcurrido en milisegundos
  const [showPopup, setShowPopup] = useState(false);

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

  // Función para manejar el cambio en el estado del checkbox
  const handleCheckboxChange = (e) => {
    setShowButtons(e.target.checked); // Cambia el estado de showButtons según el estado del checkbox
  };

  // Función para formatear el tiempo en mm:ss
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Función para manejar el clic en el botón de Play/Pause
  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying); // Cambia el estado de isPlaying al contrario de su valor actual

    if (!isPlaying) {
      // Si está en modo 'play', iniciar el contador de tiempo
      const startTime = Date.now() - elapsedTime; // Obtener el tiempo actual menos el tiempo transcurrido antes de pausar
      const id = setInterval(() => {
        const newElapsedTime = Date.now() - startTime; // Calcular el tiempo transcurrido en milisegundos
        setElapsedTime(newElapsedTime);
        setTiempoSet(formatTime(Math.floor(newElapsedTime / 1000))); // Actualizar el estado de tiempo transcurrido en formato mm:ss
      }, 1000);
      setIntervalId(id); // Guardar el ID del intervalo para poder limpiarlo más tarde
      setShowPopup(true);
    } else {
      // Si está en modo 'pause', detener el contador de tiempo
      clearInterval(intervalId); // Limpiar el intervalo activo
      setShowPopup(true);
    }
  };

  // Función para manejar el clic en el botón de Stop
  const handleStopClick = () => {
    setIsPlaying(false); // Cambiar el estado de play a false
    clearInterval(intervalId); // Limpiar el intervalo activo
    setElapsedTime(0); // Reiniciar el tiempo transcurrido
    setTiempoSet("00:00"); // Reiniciar el contador de tiempo a "00:00"
    setShowPopup(true);
  };

  useEffect(() => {
    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [intervalId]);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000); // Tiempo en milisegundos (3000ms = 3 segundos)

      return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta o si showPopup cambia
    }
  }, [showPopup]);


  return (
    <div>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="ESTADO DE PRODUCCIÓN" />
      <div className="container-conteo">
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
        <div className="contenedor-label1">
          <input
            type="checkbox"
            id="checklist"
            className="custom-checkbox-estado"
            onChange={handleCheckboxChange} // Maneja el cambio en el checkbox
          />
          <span className="elemento-label">Estación Ensamble</span>
        </div>

        {showButtons && (
          <div className="contenedor-label1">
            <div>
              <span className="elemento-label">Construcción De Set</span>
              <button
                className="bottom-time-estado"
                onClick={handlePlayPauseClick}
              >
                <div className="contenedor-svg">
                  {/* Icono de Play */}
                  {isPlaying ? (
                    <IconPause className="icono-svg" />
                  ) : (
                    <IconPlay className="icono-svg" />
                  )}
                </div>
              </button>
              <button className="bottom-time-estado" onClick={handleStopClick}>
                <div className="contenedor-svg">
                  {/* Icono de Stop */}
                  <IconStop className="icono-svg" />
                </div>
              </button>
              <span className="elemento-valor">{tiempoSet}</span>
            </div>
          </div>
        )}
      </div>
      <div className="contenido-columnas">
        <div className="tabla-columna">
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
        <div className="pdf-columna">
          <div className="pdf-container">
            <embed
              src={Instructivo}
              type="application/pdf"
              width="100%"
              height="400px"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Estado;
