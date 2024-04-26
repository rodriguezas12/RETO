import axios from 'axios'; // Importa axios para hacer solicitudes HTTP
import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import logo from "../../Media/logo.png";
import './Register.css';


export default function Register() {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [codigoEstudiantil, setCodigoEstudiantil] = useState('');
  const [nrc, setNRC] = useState('');
  const [registroExitoso, setRegistroExitoso] = useState(null);
  const [nrcValido, setNRCValido] = useState(true);
  const [camposVacios, setCamposVacios] = useState(false); // Nuevo estado para controlar campos vacíos

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // Verifica si alguno de los campos está vacío
    if (!nombreCompleto || !codigoEstudiantil || !nrc) {
      setCamposVacios(true);
      return;
    }

    try {
      // Envía una solicitud POST al servidor para registrar los datos
      const response = await axios.post('http://localhost:3000/register', {
        nombre_completo: nombreCompleto,
        codigo_estudiantil: codigoEstudiantil,
        nrc: nrc
      });

      // Verifica si el NRC ingresado coincide con el NRC almacenado en la tabla
      if (response.data === 'Registro exitoso' && !nrcValido) {
        setRegistroExitoso('Error: El NRC ingresado no es válido');
        return;
      }

      setRegistroExitoso('Registro exitoso');
      // Restablece los campos después de enviar los datos
      setNombreCompleto('');
      setCodigoEstudiantil('');
      setNRC('');
      setNRCValido(true);
      setCamposVacios(false); // Restablece el estado de campos vacíos
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      setRegistroExitoso('Error de registro');
    }
  };

  const validarNRC = async () => {
    try {
      // Realiza una solicitud GET al servidor para obtener el NRC almacenado en la tabla
      const response = await axios.get('http://localhost:3000/nrc');

      // Compara el NRC ingresado con el NRC almacenado
      if (response.data !== nrc) {
        setNRCValido(false);
        return;
      }

      setNRCValido(true);
    } catch (error) {
      console.error('Error al validar el NRC:', error);
      setNRCValido(false);
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
      <div className="login-box">
        <img src={logo} alt="Logo" />
        <form onSubmit={handleFormSubmit}>
          <h3>NOMBRE COMPLETO:</h3>
          <input
            type="text"
            placeholder="Nombre completo"
            value={nombreCompleto}
            onChange={(e) => setNombreCompleto(e.target.value)}
          />
          <h3>CODIGO ESTUDIANTIL:</h3>
          <input
            type="text"
            placeholder="Código estudiantil"
            value={codigoEstudiantil}
            onChange={(e) => setCodigoEstudiantil(e.target.value)}
          />
          <h3>NRC:</h3>
          <input
            type="text"
            placeholder="NRC"
            value={nrc}
            onChange={(e) => setNRC(e.target.value)}
            onBlur={validarNRC}
          />
          
            <button type="submit">Registrar</button>
          
        </form>
        {/* Muestra el mensaje de registro exitoso o de error */}
        {registroExitoso && <p>{registroExitoso}</p>}
        {/* Muestra el mensaje de error si el NRC no es válido */}
        {!nrcValido && <p>Error: El NRC ingresado no es válido</p>}
        {/* Muestra el mensaje de error si algún campo está vacío */}
        {camposVacios && <p>Error: Todos los campos son obligatorios</p>}
        <Link to="/">
            <button type="button">Volver</button>
          </Link>
      </div>
    </>
  );
}
