import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import "./Asignacion.css";
import Header from "../components/header";
import axios from "axios";

const Asignacion = () => {
  const [tags, setTags] = useState([]); // Estado para almacenar los tags
  const [nombresKits, setNombresKits] = useState({}); // Estado para almacenar los nombres de los kits

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get("http://localhost:5000/tag");

        if (response.data.length > 0) {
          setTags(response.data); // Almacenamos todos los tags en el estado
          const initialNombresKits = {};
          for (const tag of response.data) {
            const nombreKitResponse = await axios.get(`http://localhost:5000/nombrekit/${tag}`);
            initialNombresKits[tag] = nombreKitResponse.data || ""; // Si no hay nombre, se deja vacío
          }
          setNombresKits(initialNombresKits); // Inicializamos los nombres de los kits
        } else {
          setTags(["No hay tags disponibles"]); // En caso de no haber tags disponibles
        }
      } catch (error) {
        console.error("Error al obtener los tags:", error);
        setTags(["Error al obtener los tags"]); // Manejamos errores
      }
    };

    fetchTags();

    const interval = setInterval(fetchTags, 20000); // Actualizamos cada 5 segundos

    return () => clearInterval(interval); // Limpiamos el intervalo al desmontar el componente
  }, []); // La dependencia vacía asegura que este efecto se ejecute solo una vez al cargar el componente

  const handleNombreKitChange = (event, tag) => {
    setNombresKits({ ...nombresKits, [tag]: event.target.value }); // Actualizamos el estado del nombre del kit
  };

  const handleGuardarNombreKit = async (tag) => {
    try {
      await axios.post(`http://localhost:5000/nombrekit/${tag}`, {
        nombreKit: nombresKits[tag],
      });
      console.log(`Nombre de kit para el tag ${tag} guardado correctamente`);
    } catch (error) {
      console.error(`Error al guardar el nombre del kit para el tag ${tag}:`, error);
    }
  };

  return (
    <div>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="Asignación Kits" />
      
      <div className="contenedor">
        {/* Sección para TAG LEIDO */}
        <div className="column">
          <div style={{ textAlign: "center", marginBottom: "10px" }}>TAGS LEÍDOS</div>
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <div key={index}>
                <span>{tag}</span>
              </div>
            ))
          ) : (
            <span>{tags[0]}</span>
          )}
        </div>

        {/* Sección para Nombre del Kit */}
        <div className="column">
          <div style={{ textAlign: "center", marginBottom: "10px" }}>NOMBRE DEL KIT</div>
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={nombresKits[tag]}
                  onChange={(event) => handleNombreKitChange(event, tag)}
                  placeholder="Escribir nombre de kit"
                />
                <button onClick={() => handleGuardarNombreKit(tag)}>Guardar</button>
              </div>
            ))
          ) : (
            <span>{tags[0]}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Asignacion;
