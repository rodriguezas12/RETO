import React, { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import "./Eventos.css";

function Eventos() {
  const [data, setData] = useState([]);
  const [kitArmado, setKitArmado] = useState(0);
  const [ensamblados, setEnsablados] = useState(0);
  const [selectedStation, setSelectedStation] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    solicitudes: false,
    ingresoMaterial: false,
    kitsArmados: false,
  });
  const [filters, setFilters] = useState({
    fechaInteres: "",
    horaInicial: "",
    horaFinal: "",
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

  const fetchSolicitudes = async () => {
    if (checkboxes.solicitudes) {
      try {
        const { fechaInteres, horaInicial, horaFinal } = filters;
        const query = new URLSearchParams({
          fechaInteres,
          horaInicial,
          horaFinal,
        }).toString();

        const response = await fetch(`http://localhost:5000/eventos?${query}`);
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const solicitudesData = await response.json();
        setData(solicitudesData);
        console.log("Consulta a Solicitudes exitosa");
      } catch (error) {
        console.error("Error fetching data for Solicitudes:", error);
      }
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: checked,
    }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleConsultaClick = () => {
    fetchSolicitudes();
  };

  return (
    <div>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="CONSULTA DE EVENTOS" />
      <div className="container-titulo">
        <h2 className="titulo-evento">Seleccione evento de interés</h2>
      </div>

      <div className="container">
        <div className="container-checkboxes">
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

            <label>
              <input
                type="checkbox"
                name="ingresoMaterial"
                checked={checkboxes.ingresoMaterial}
                onChange={handleCheckboxChange}
              />
              Ingreso Material
            </label>

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

        <div className="container-filtros">
          <div className="contenedor-label1">
            <label>
              Fecha de interés:
              <input
                type="date"
                name="fechaInteres"
                value={filters.fechaInteres}
                onChange={handleFilterChange}
              />
            </label>

            <label>
              Hora inicial:
              <input
                type="time"
                name="horaInicial"
                value={filters.horaInicial}
                onChange={handleFilterChange}
              />
            </label>

            <label>
              Hora final:
              <input
                type="time"
                name="horaFinal"
                value={filters.horaFinal}
                onChange={handleFilterChange}
              />
            </label>
          </div>
          <div className="container-boton-consulta">
            <button onClick={handleConsultaClick}>Consultar</button>
          </div>
        </div>
      </div>

      <div className="container-conteo">
        <div className="contenedor-label1">
          <span className="elemento-label">Kits Armados:</span>
          <span className="elemento-valor">{kitArmado}</span>
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

      {data.length > 0 && (
        <div className="container-estado">
          <span className="subtitle">REGISTRO DE EVENTOS:</span>
        </div>
      )}

      {data.length > 0 && (
        <div className="tabla-container">
          <table className="tabla-eventos">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Evento</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Hora</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.usuario}</td>
                  <td>{item.evento}</td>
                  <td>{item.descripcion}</td>
                  <td>{item.fecha}</td>
                  <td>{item.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Eventos;
