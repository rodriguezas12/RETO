import React, { useState } from 'react';
import './Home.css';
import logo from '../Media/logo.png';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Importa Link desde react-router-dom

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
        <h3>PORTAL DE GESTION INDUSTRIAL</h3>
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
        <Link to="/register">
          <button type="button">Registrarse</button>
        </Link>
      </div>
    </>
  );
}
