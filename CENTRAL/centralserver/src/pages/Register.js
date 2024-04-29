import axios from "axios"; // Importa axios para hacer solicitudes HTTP
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../Media/logo.png";
import "./Register.css";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [codigoEstudiantil, setCodigoEstudiantil] = useState("");
  const [nrc, setNRC] = useState("");
  const [registroExitoso, setRegistroExitoso] = useState(null);
  const [camposVacios, setCamposVacios] = useState(false);
  const [errorNombre, setErrorNombre] = useState(false); // Cambiado a false
  const [errorCodigoEstudiantil, setErrorCodigoEstudiantil] = useState(false); // Cambiado a false
  const [errorNRC, setErrorNRC] = useState(false); // Cambiado a false

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Verifica si hay errores en los campos
    if (errorNombre || errorCodigoEstudiantil || errorNRC) {
      return;
    }

    try {
      // Envía una solicitud POST al servidor para registrar los datos
      await axios.post("http://localhost:3000/register", {
        nombre: nombre,
        codigo_estudiantil: codigoEstudiantil,
        nrc: nrc,
      });

      setRegistroExitoso("Registro exitoso");
      // Restablece los campos después de enviar los datos
      setNombre("");
      setCodigoEstudiantil("");
      setNRC("");
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setRegistroExitoso("Error de registro");
    }
  };

  // Función para validar el nombre
  const validarNombre = () => {
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜ\s]+$/;
    if (!nombreRegex.test(nombre)) {
      setErrorNombre(true); // Cambiado a true
    } else {
      setErrorNombre(false); // Cambiado a false
    }
  };

  // Función para validar el código estudiantil y verificar la existencia del usuario
  const validarCodigoEstudiantil = async () => {
    const codigoEstudiantilNumerico = /^\d+$/;
    if (!codigoEstudiantilNumerico.test(codigoEstudiantil)) {
      setErrorCodigoEstudiantil(true); // Cambiado a true
    } else {
      try {
        // Verifica si el usuario ya existe en la base de datos
        const response = await axios.post(
          "http://localhost:3000/verificarUsuario",
          {
            codigoEstudiantil: codigoEstudiantil,
          }
        );
        if (response.data.mensaje === "Usuario no encontrado") {
          setErrorCodigoEstudiantil(false); // Cambiado a false
        } else {
          setErrorCodigoEstudiantil(true); // Cambiado a true
        }
      } catch (error) {
        console.error("Error al verificar el usuario:", error);
        setErrorCodigoEstudiantil(true); // Cambiado a true
      }
    }
  };

  // Función para validar el NRC
  const validarNRC = () => {
    if (nrc !== "12341") {
      setErrorNRC(true); // Cambiado a true
    } else {
      setErrorNRC(false); // Cambiado a false
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
          {errorNombre && <p className="error-message">Nombre no válido</p>}
          <label>CODIGO ESTUDIANTIL:</label>
          <input
            type="text"
            placeholder="Código estudiantil"
            value={codigoEstudiantil}
            onChange={(e) => setCodigoEstudiantil(e.target.value)}
            onBlur={validarCodigoEstudiantil}
          />
          {errorCodigoEstudiantil && (
            <p className="error-message">Código Estudiantil no válido</p>
          )}
          <label>NRC:</label>
          <input
            type="text"
            placeholder="NRC"
            value={nrc}
            onChange={(e) => setNRC(e.target.value)}
            onBlur={validarNRC}
          />
          {errorNRC && <p className="error-message">NRC no válido</p>}
          {/* Muestra el mensaje de campos vacíos */}
          {camposVacios && (
            <p className="error-message">
              Error: Todos los campos son obligatorios
            </p>
          )}
          {/* Muestra el mensaje de registro exitoso o de error */}
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
