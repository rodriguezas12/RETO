import React, { useState, useEffect } from "react";
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
    asignacionKits: false,
    asignacionContenido: false,
    setsTerminados: false,
    salida: false,
    entrada: false,
  });
  const [filters, setFilters] = useState({
    fechaInicio: "",
    fechaFin: "",
    horaInicio: "",
    horaFin: "",
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
    // Aplica la clase eventos-body al body y html cuando el componente se monta
    document.body.classList.add("eventos-body");
    document.documentElement.classList.add("eventos-body");

    // Limpia la clase eventos-body cuando el componente se desmonta
    return () => {
      document.body.classList.remove("eventos-body");
      document.documentElement.classList.remove("eventos-body");
    };
  }, []);

  const fetchEventos = async () => {
    if (
      !checkboxes.solicitudes &&
      !checkboxes.ingresoMaterial &&
      !checkboxes.kitsArmados &&
      !checkboxes.asignacionKits &&
      !checkboxes.asignacionContenido &&
      !checkboxes.setsTerminados &&
      !checkboxes.salida &&
      !checkboxes.entrada
    ) {
      // Si ningún checkbox está seleccionado, limpiar los datos
      setData([]);
      return;
    }

    try {
      const { fechaInicio, fechaFin, horaInicio, horaFin } = filters;
      const query = new URLSearchParams({
        fechaInteres: fechaInicio,
        fechaFin,
        horaInicial: horaInicio,
        horaFinal: horaFin,
        solicitudes: checkboxes.solicitudes ? "true" : "",
        ingresoMaterial: checkboxes.ingresoMaterial ? "true" : "",
        kitsArmados: checkboxes.kitsArmados ? "true" : "",
        asignacionKits: checkboxes.asignacionKits ? "true" : "",
        asignacionContenido: checkboxes.asignacionContenido ? "true" : "",
        setsTerminados: checkboxes.setsTerminados ? "true" : "",
        salida: checkboxes.salida ? "true" : "",
        entrada: checkboxes.entrada ? "true" : "",
      }).toString();

      const response = await fetch(`http://localhost:5000/eventos?${query}`);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const eventosData = await response.json();
      setData(eventosData);
      console.log("Consulta a Eventos exitosa");
    } catch (error) {
      console.error("Error fetching data for Eventos:", error);
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

    if (name === "fechaInicio") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        fechaInicio: value,
        fechaFin: "", // Reset fechaFin when fechaInicio changes
        horaInicio: "", // Reset horaInicio when fechaInicio changes
        horaFin: "", // Reset horaFin when fechaInicio changes
      }));
    } else if (name === "fechaFin") {
      if (new Date(value) >= new Date(filters.fechaInicio)) {
        setFilters((prevFilters) => ({
          ...prevFilters,
          fechaFin: value,
        }));
      }
    } else if (name === "horaInicio") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        horaInicio: value,
        horaFin: "", // Reset horaFin when horaInicio changes
      }));
    } else if (name === "horaFin") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        horaFin: value,
      }));
    }
  };

  const handleConsultaClick = () => {
    fetchEventos();
  };

  return (
    <div className="eventos-wrapper">
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="CONSULTA DE EVENTOS" />
      <div className="eventos-container-titulo">
        <h2 className="eventos-titulo-evento">Seleccione evento de interés</h2>
      </div>

      <div className="eventos-container">
        <div className="eventos-container-checkboxes">
          <div className="eventos-contenedor-label1">
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

            <label>
              <input
                type="checkbox"
                name="asignacionKits"
                checked={checkboxes.asignacionKits}
                onChange={handleCheckboxChange}
              />
              Asignación de Kits
            </label>

            <label>
              <input
                type="checkbox"
                name="asignacionContenido"
                checked={checkboxes.asignacionContenido}
                onChange={handleCheckboxChange}
              />
              Asignación de Contenido
            </label>

            <label>
              <input
                type="checkbox"
                name="setsTerminados"
                checked={checkboxes.setsTerminados}
                onChange={handleCheckboxChange}
              />
              Sets Terminados
            </label>

            <label>
              <input
                type="checkbox"
                name="salida"
                checked={checkboxes.salida}
                onChange={handleCheckboxChange}
              />
              Salida
            </label>

            <label>
              <input
                type="checkbox"
                name="entrada"
                checked={checkboxes.entrada}
                onChange={handleCheckboxChange}
              />
              Entrada
            </label>
          </div>
        </div>

        <div className="eventos-container-filtros">
          <div className="eventos-contenedor-label1">
            <label>
              Fecha de inicio:
              <input
                type="date"
                name="fechaInicio"
                value={filters.fechaInicio}
                onChange={handleFilterChange}
              />
            </label>

            <label>
              Fecha de fin:
              <input
                type="date"
                name="fechaFin"
                value={filters.fechaFin}
                onChange={handleFilterChange}
                disabled={!filters.fechaInicio}
                min={filters.fechaInicio}
              />
            </label>

            <label>
              Hora de inicio:
              <input
                type="time"
                name="horaInicio"
                value={filters.horaInicio}
                onChange={handleFilterChange}
                disabled={!filters.fechaFin}
              />
            </label>

            <label>
              Hora de fin:
              <input
                type="time"
                name="horaFin"
                value={filters.horaFin}
                onChange={handleFilterChange}
                disabled={!filters.horaInicio}
              />
            </label>
          </div>
          <div className="eventos-container-boton-consulta">
            <button onClick={handleConsultaClick}>Consultar</button>
          </div>
        </div>
      </div>

      <div className="eventos-container-conteo">
        <div className="eventos-contenedor-label1">
          <span className="eventos-elemento-label">Kits Armados:</span>
          <span className="eventos-elemento-valor">{kitArmado}</span>
        </div>
        <div className="eventos-contenedor-label1">
          <span className="eventos-elemento-label">Productos Ensamblados:</span>
          <span className="eventos-elemento-valor">{ensamblados}</span>
        </div>
        <div className="eventos-contenedor-label1">
          <span className="eventos-elemento-label">
            Seleccione la estación de interés:
          </span>
          <select
            className="eventos-elemento-valor"
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
        <div className="eventos-container-estado">
          <span className="eventos-subtitle">REGISTRO DE EVENTOS:</span>
        </div>
      )}

      {data.length > 0 && (
        <div className="eventos-tabla-container">
          <table className="eventos-tabla-eventos">
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
