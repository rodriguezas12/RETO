import React from 'react';
import './Home.css';
import logo from '../Media/logo.png';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

export default function Home() {
  return (
    <>
      <h2>Home Page</h2>
      <div className="login-box">
        <img src={logo} alt="Logo" />
        <h3>PORTAL DE GESTION INDUSTRIAL</h3>
        <form>
          <label>INGRESE SU USUARIO:</label>
          <input type="text" placeholder="Usuario" />
          {/* Enlace al componente Login */}
          <Link to="/login">
            <button type="button">Iniciar Sesión</button>
          </Link>
        </form>
        {/* Enlace al componente Register */}
        <Link to="/register">
          <button type="button">Registrarse</button>
        </Link>
      </div>
    </>
  );
}
