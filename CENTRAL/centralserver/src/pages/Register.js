import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Media/logo.png";
import "./Register.css";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [codigoEstudiantil, setCodigoEstudiantil] = useState("");
  const [nrc, setNRC] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(null);
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorNRC, setErrorNRC] = useState(false);
  const [camposVacios, setCamposVacios] = useState(false);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (nombre === "" || codigoEstudiantil === "" || nrc === "") {
      setCamposVacios(true);
      return;
    }

    if (errorNombre || errorNRC) {
      return;
    }

    try {
      await axios.post("http://localhost:5000/register", {
        nombre: nombre,
        codigoEstudiantil: codigoEstudiantil,
        nrc: nrc,
      });

      setRegistroExitoso("Registro exitoso");
      setNombre("");
      setCodigoEstudiantil("");
      setNRC("");
      setCamposVacios(false);
      setErrorNombre(false); // Limpiar errores
      setErrorNRC(false); // Limpiar errores
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setRegistroExitoso("Error de registro");
    }
  };

  const validarNombre = () => {
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/;
    if (!nombreRegex.test(nombre)) {
      setErrorNombre(true);
    } else {
      setErrorNombre(false);
    }
  };

  const validarNRC = () => {
    if (nrc !== "12341") {
      setErrorNRC(true);
    } else {
      setErrorNRC(false);
    }
  };

  return (
    <>
      <h2>REGISTRATE</h2>
      <div className="login-box">
        <img src={logo} alt="Logo" />
        <form onSubmit={handleFormSubmit}>
          <label>NOMBRE:</label>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={validarNombre}
          />
          <label>CODIGO ESTUDIANTIL:</label>
          <input
            type="text"
            placeholder="Código estudiantil"
            value={codigoEstudiantil}
            onChange={(e) => setCodigoEstudiantil(e.target.value)}
          />
          <label>NRC:</label>
          <input
            type="text"
            placeholder="NRC"
            value={nrc}
            onChange={(e) => setNRC(e.target.value)}
            onBlur={validarNRC}
          />
          {camposVacios && (
            <p className="error-message">
              Error: Todos los campos son obligatorios
            </p>
          )}
          {errorNombre && <p className="error-message">Nombre no válido</p>}
          {errorNRC && <p className="error-message">NRC no válido</p>}
          {registroExitoso && <p>{registroExitoso}</p>}
          <button type="submit">Registrar</button>
        </form>
        <Link to="/">
          <button type="button">Volver</button>
        </Link>
      </div>
    </>
  );
}
