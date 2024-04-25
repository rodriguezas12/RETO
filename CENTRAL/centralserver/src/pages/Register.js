// Register.js

import React, { useState } from 'react';
import './Register.css';
import logo from '../Media/logo.png';
import axios from 'axios'; // Importa axios para hacer solicitudes HTTP

export default function Register() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [codigoEstudiantil, setCodigoEstudiantil] = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envía una solicitud POST al servidor para registrar los datos
      await axios.post('http://localhost:3000/register', {
        nombre_completo: nombreCompleto,
        codigo_estudiantil: codigoEstudiantil
      });

      setRegistroExitoso('Registro exitoso');
      // Restablece los campos después de enviar los datos
      setNombreCompleto('');
      setCodigoEstudiantil('');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      setRegistroExitoso('Error de registro');
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
        {/* Muestra el mensaje de registro exitoso o de error */}
        {registroExitoso && <p>{registroExitoso}</p>}
      </div>
    </>
  );
}
