// Home.js

import axios from "axios";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import logo from "../Media/logo.png";
import "./Home.css";
// Importa useNavigate en lugar de useHistory
import { useNavigate } from "react-router-dom";

export default function Home({ setAuthenticated }) {
  const [usuario, setUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");
  // Utiliza useNavigate en lugar de useHistory
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setUsuario(e.target.value);
  };

  const verificarUsuario = async () => {
    if (!usuario) {
      setMensaje("Ingrese un usuario válido");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/verificarUsuario",
        {
          codigoEstudiantil: usuario,
        }
      );

      setMensaje(response.data.mensaje);

      if (response.data.mensaje === "Usuario encontrado") {
        setAuthenticated(true);
        // Utiliza navigate en lugar de history.push
        navigate("/menu"); // Navega a la página de menú después de la autenticación
      }
    } catch (error) {
      console.error("Error al verificar el usuario:", error);
      setMensaje("Error al verificar el usuario");
    }
  };

  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className="home-box">
        <img src={logo} alt="Logo" />
        <h3>PORTAL DE GESTION INDUSTRIAL</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verificarUsuario();
          }}
        >
          <h4>INGRESE SU CODIGO ESTUDIANTIL:</h4>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={handleInputChange}
            autoFocus
          />
          <button type="submit">Iniciar Sesión</button>
          {mensaje && <p>{mensaje}</p>}
        </form>
        <a href="/register">
          <button type="button">Registrarse</button>
        </a>
      </div>
    </>
  );
}
