import axios from "axios";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import "./Asignacion.css";

const Asignacion = () => {
  const [tags, setTags] = useState([]);
  const [nombresKits, setNombresKits] = useState({});
  const [idsKits, setIdsKits] = useState({});
  const [selectedStation, setSelectedStation] = useState("");
  const [showContendIds, setShowContendIds] = useState(false);

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
    const fetchTags = async () => {
      try {
        if (!selectedStation) return;
        const stationNumber = selectedStation.split(" ")[1];
        const response = await axios.get(`http://localhost:5000/tag/${stationNumber}`);

        if (response.data.length > 0) {
          const initialNombresKits = {};
          const initialIdsKits = {};
          for (const tag of response.data) {
            initialNombresKits[tag] = await fetchNombreKit(tag, stationNumber);
            initialIdsKits[tag] = await fetchIdKit(tag, stationNumber);
          }
          setTags(response.data);
          setNombresKits(initialNombresKits);
          setIdsKits(initialIdsKits);
        } else {
          setTags(["No hay tags disponibles"]);
        }
      } catch (error) {
        console.error("Error al obtener los tags:", error);
        setTags(["Error al obtener los tags"]);
      }
    };

    const fetchNombreKit = async (tag, stationNumber) => {
      try {
        const nombreKitResponse = await axios.get(
          `http://localhost:5000/nombrekit/${tag}/${stationNumber}`
        );
        return nombreKitResponse.data || "";
      } catch (error) {
        console.error(
          `Error al obtener el nombre del kit para el tag ${tag} en la estación ${stationNumber}:`,
          error
        );
        return "";
      }
    };

    const fetchIdKit = async (tag, stationNumber) => {
      try {
        const idKitResponse = await axios.get(
          `http://localhost:5000/idkit/${tag}/${stationNumber}`
        );
        return idKitResponse.data || "";
      } catch (error) {
        console.error(
          `Error al obtener el ID del kit para el tag ${tag} en la estación ${stationNumber}:`,
          error
        );
        return "";
      }
    };

    fetchTags();

    const interval = setInterval(fetchTags, 20000);

    return () => clearInterval(interval);
  }, [selectedStation]);

  const handleNombreKitChange = (event, tag) => {
    setNombresKits({ ...nombresKits, [tag]: event.target.value });
  };

  const handleGuardarNombreKit = async (tag) => {
    const stationNumber = selectedStation.split(" ")[1];
    try {
      await axios.post(`http://localhost:5000/nombrekit/${tag}/${stationNumber}`, {
        nombreKit: nombresKits[tag],
      });
      console.log(`Nombre de kit para el tag ${tag} guardado correctamente`);
      setNombresKits({ ...nombresKits, [tag]: nombresKits[tag] });
    } catch (error) {
      console.error(
        `Error al guardar el nombre del kit para el tag ${tag}:`,
        error
      );
    }
  };

  const handleIdKitChange = (event, tag) => {
    setIdsKits({ ...idsKits, [tag]: event.target.value });
  };

  const handleGuardarIdKit = async (tag) => {
    const stationNumber = selectedStation.split(" ")[1];
    try {
      await axios.post(`http://localhost:5000/idkit/${tag}/${stationNumber}`, {
        idKit: idsKits[tag],
      });
      console.log(`ID de kit para el tag ${tag} guardado correctamente`);
      setIdsKits({ ...idsKits, [tag]: idsKits[tag] });
    } catch (error) {
      console.error(`Error al guardar el ID del kit para el tag ${tag}:`, error);
    }
  };

  return (
    <div className="container">
      <Helmet>
        <title>Asignación de Kits</title>
      </Helmet>
      <Header />
      <div className="selector-container">
        <h3>Seleccionar estación</h3>
        <select
          className="station-selector"
          value={selectedStation}
          onChange={(e) => setSelectedStation(e.target.value)}
        >
          <option value="">Seleccione una estación</option>
          {stations.map((station) => (
            <option key={station} value={station}>
              {station}
            </option>
          ))}
        </select>
      </div>
      <div className="tags-container">
        {tags.length > 0 && (
          <div className="tag-list">
            {tags[0] === "No hay tags disponibles" ? (
              <p>No hay tags disponibles para la estación seleccionada</p>
            ) : tags[0] === "Error al obtener los tags" ? (
              <p>Error al obtener los tags</p>
            ) : (
              tags.map((tag) => (
                <div key={tag} className="tag-item">
                  <div className="tag-info">
                    <h4>Tag: {tag}</h4>
                    <label htmlFor={`nombreKit-${tag}`}>Nombre del Kit:</label>
                    <input
                      type="text"
                      id={`nombreKit-${tag}`}
                      value={nombresKits[tag] || ""}
                      onChange={(e) => handleNombreKitChange(e, tag)}
                    />
                    <button
                      className="save-button"
                      onClick={() => handleGuardarNombreKit(tag)}
                    >
                      Guardar Nombre Kit
                    </button>
                    {showContendIds && (
                      <>
                        <label htmlFor={`idKit-${tag}`}>ID del Kit:</label>
                        <input
                          type="text"
                          id={`idKit-${tag}`}
                          value={idsKits[tag] || ""}
                          onChange={(e) => handleIdKitChange(e, tag)}
                        />
                        <button
                          className="save-button"
                          onClick={() => handleGuardarIdKit(tag)}
                        >
                          Guardar ID Kit
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="show-ids">
        <label htmlFor="showContendIds">Mostrar IDs:</label>
        <input
          type="checkbox"
          id="showContendIds"
          checked={showContendIds}
          onChange={() => setShowContendIds(!showContendIds)}
        />
      </div>
    </div>
  );
};

export default Asignacion;
