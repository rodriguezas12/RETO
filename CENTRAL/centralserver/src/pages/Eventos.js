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
    if (!checkboxes.solicitudes && !checkboxes.ingresoMaterial) {
      // Si ningún checkbox está seleccionado, limpiar los datos
      setData([]);
      return;
    }

    try {
      const { fechaInteres, horaInicial, horaFinal } = filters;
      const query = new URLSearchParams({
        fechaInteres,
        horaInicial,
        horaFinal,
        solicitudes: checkboxes.solicitudes ? 'true' : '',
        ingresoMaterial: checkboxes.ingresoMaterial ? 'true' : ''
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
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleConsultaClick = () => {
    fetchEventos();
  };

  return (
    <div className="eventos-wrapper">
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
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
          </div>
        </div>

        <div className="eventos-container-filtros">
          <div className="eventos-contenedor-label1">
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
