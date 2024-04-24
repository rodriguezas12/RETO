import React from 'react';
import './Register.css';
import logo from '../Media/logo.png';

export default function Register() {
  return (
    <>
      <h2>REGISTRATE</h2>
      <div className="login-box">
        <img src={logo} alt="Logo" />
        <form>
          <label>NOMBRE COMPLETO:</label>
          <input type="text" placeholder="Nombre completo" />
          <label>CODIGO ESTUDIANTIL:</label>
          <input type="text" placeholder="Código estudiantil" />
          <label>NRC:</label>
          <input type="text" placeholder="NRC" />
          <button type="submit">Registrar</button>
        </form>
      </div>
    </>
  );
}
