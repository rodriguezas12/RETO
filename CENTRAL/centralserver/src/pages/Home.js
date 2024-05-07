import axios from "axios";
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import logo from "../Media/logo.png";
import "./Home.css";
 

export default function Home() {
  const [usuario, setUsuario] = useState("");
  const [mensaje, setMensaje] = useState("");

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

      // Si el usuario es encontrado en la base de datos, redirige a la página de inicio de sesión
      if (response.data.mensaje === "Usuario encontrado") {
        window.location.href = "http://localhost:3000/Menu";
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
        <div className="home-box">
          <img src={logo} alt="Logo" />
          <h3>PORTAL DE GESTION INDUSTRIAL</h3>
      <form onSubmit={(e) => {
        e.preventDefault(); // Previene la recarga de la página
        verificarUsuario();
      }}>
      <h4>INGRESE SU CODIGO ESTUDIANTIL:</h4>
      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={handleInputChange}
        autoFocus // opcional: pone el foco en el input al cargar el componente
      />
      <button type="submit">
        Iniciar Sesión
      </button>
      {mensaje && <p>{mensaje}</p>}
    </form>
          {/* Enlace al componente Register */}
          <a href="/register">
            <button type="button">Registrarse</button>
          </a>
        </div>
    </>
  );
}