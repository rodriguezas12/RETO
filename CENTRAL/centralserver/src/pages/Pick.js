import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import Header from '../components/header';
import "./Pick.css";

function Pick() {
  const [rfidText, setRfidText] = useState(""); // Estado para almacenar el texto ingresado
  const [epValue, setEpValue] = useState(""); // Estado para almacenar el valor del EP

  const textAreaRef = useRef(null); // Ref para el cuadro de texto

  // Función para buscar el valor del EP
  const searchEP = (text) => {
    // Expresión regular para buscar el valor de EP
    const regex = /EP:\s*([A-Z0-9]+)/;
    const match = text.match(regex);
    if (match) {
      setEpValue(match[1]); // El valor del EP es el primer grupo capturado por la regex
      updateInv(match[1]); // Llamar a la función para actualizar INV
    } else {
      setEpValue(""); // Si no se encuentra EP, limpiar el estado
    }
  };

  // Función para enviar solicitud POST al backend para actualizar INV
  const updateInv = (ep) => {
    fetch("http://localhost:5000/actualizarINV", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ EP: ep }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("There was an error with the fetch operation:", error);
      });
  };

  // Efecto para limpiar el cuadro de texto después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setRfidText("");
    }, 5000);

    return () => clearTimeout(timer);
  }, [epValue]); // Se ejecuta cada vez que cambia el valor de epValue

  // Efecto para hacer clic automático en el cuadro de texto cada 6 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }, 5100);

    return () => clearInterval(interval);
  }, []);



  const handleRfidTextChange = (event) => {
    // Limitar a 36 caracteres
    const text = event.target.value.slice(0, 36);
    setRfidText(text);

    // Si alcanza los 36 caracteres, buscar EP automáticamente
    if (text.length === 36) {
      searchEP(text);
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
        <label htmlFor="rfidText">Ingresa el texto RFID (máx. 36 caracteres):</label>
        <textarea
          id="rfidText"
          ref={textAreaRef}
          rows="4"
          cols="50"
          maxLength="36"
          value={rfidText}
          onChange={handleRfidTextChange}
        />
      </div>
      <div className="ep-value-display">
        <p>Último EP encontrado: {epValue}</p>
      </div>
    </div>
  );
}

export default Pick;
