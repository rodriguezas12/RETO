import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import "./Pick.css";
import Header from '../components/header';

function Pick() {
  const [rfidText, setRfidText] = useState(""); // Estado para almacenar el texto ingresado
  const [epValue, setEpValue] = useState(""); // Estado para almacenar el valor del EP
  const rfidTextareaRef = useRef(null); // Referencia para el textarea

  // Efecto para enfocar el textarea al cargar la página
  useEffect(() => {
    rfidTextareaRef.current.focus();
  }, []);

  const handleRfidTextChange = (event) => {
    // Limitar a 35 caracteres
    const text = event.target.value.slice(0, 35);
    setRfidText(text);

    // Si alcanza los 35 caracteres, buscar EP automáticamente
    if (text.length === 35) {
      handleSearchEP(text);
    } else {
      setEpValue(""); // Limpiar el valor del EP si se modifica el texto
    }
  };

  const handleSearchEP = (text) => {
    // Expresión regular para buscar el valor de EP
    const regex = /EP:\s*([A-Z0-9]+)/;
    const match = text.match(regex);
    if (match) {
      setEpValue(match[1]); // El valor del EP es el primer grupo capturado por la regex
    } else {
      setEpValue(""); // Si no se encuentra EP, limpiar el estado
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
      <Header titulo="VERIFICACIÓN PICK TO LIGHT" />
      <div className="input-container">
        <label htmlFor="rfidText">Ingresa el texto RFID (máx. 35 caracteres):</label>
        <textarea
          id="rfidText"
          rows="4"
          maxLength="35"
          value={rfidText}
          onChange={handleRfidTextChange}
          ref={rfidTextareaRef} // Asignar la referencia al textarea
          className="transparent-textarea" // Agregar clase para hacerlo transparente
        />
        {/* No se necesita un botón explícito para buscar EP */}
      </div>
      <div className="ep-value-display">
        <p>Último EP encontrado: {epValue}</p>
      </div>
    </div>
  );
}

export default Pick;
