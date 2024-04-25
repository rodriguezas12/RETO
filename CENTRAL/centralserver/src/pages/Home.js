import axios from 'axios';
import React, { useState } from 'react';
import logo from '../Media/logo.png';
import './Home.css';

export default function Home() {
  const [usuario, setUsuario] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleInputChange = (e) => {
    setUsuario(e.target.value);
  };

  const verificarUsuario = async () => {
    if (!usuario) {
      setMensaje('Ingrese un usuario válido');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/verificarUsuario', {
        codigoEstudiantil: usuario
      });

      setMensaje(response.data.mensaje);

      // Si el usuario es encontrado en la base de datos, redirige a la página de inicio de sesión
      if (response.data.mensaje === 'Usuario encontrado') {
        window.location.href = 'http://localhost:3001/menú';
      }
    } catch (error) {
      console.error('Error al verificar el usuario:', error);
      setMensaje('Error al verificar el usuario');
    }
  };

  return (
    <>
      <h2>Home Page</h2>
      <div className="login-box">
        <img src={logo} alt="Logo" />
        <h3>PORTAL DE GESTION INDUSTRIAL f</h3>
        <form>
          <label>INGRESE SU USUARIO:</label>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={handleInputChange}
          />
          <button type="button" onClick={verificarUsuario}>Iniciar Sesión</button>
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
