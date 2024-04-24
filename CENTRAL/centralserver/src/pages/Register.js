// Register.js

import React, { useState } from 'react';
import './Register.css';
import logo from '../Media/logo.png';
import axios from 'axios';

export default function Register() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [codigoEstudiantil, setCodigoEstudiantil] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/register', {
        nombre_completo: nombreCompleto,
        codigo_estudiantil: codigoEstudiantil
      });

      console.log(response.data.message);
      // Restablece los campos después de que se haya registrado el usuario
      setNombreCompleto('');
      setCodigoEstudiantil('');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      // Maneja el error aquí
    }
  };

  return (
    <>
      <h2>REGISTRATE</h2>
      <div className="login-box">
        <img src={logo} alt="Logo" />
        <form onSubmit={handleFormSubmit}>
          <label>NOMBRE COMPLETO:</label>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
          />
          <label>CODIGO ESTUDIANTIL:</label>
          <input
            type="text"
            placeholder="Código estudiantil"
            value={codigoEstudiantil}
            onChange={(e) => setCodigoEstudiantil(e.target.value)}
          />
          <button type="submit">Registrar</button>
        </form>
      </div>
    </>
  );
}
