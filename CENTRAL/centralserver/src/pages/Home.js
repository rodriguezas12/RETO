import React from 'react';
import './Home.css';
import logo from '../Media/logo.png'

export default function Home() {
  return (
    <>
      <h2>Home Page</h2>
      <div className="login-box">
        <img src={logo}alt="Logo" />
        <h3>PORTAL DE GESTION INDUSTRIAL</h3>
        <form>
          <label>INGRESE SU USUARIO:</label>
          <input type="text" placeholder="Usuario" />
          <button type="submit">Iniciar Sesión</button>
        </form>
        <button>Registrarse</button>
      </div>
    </>
  );
}
