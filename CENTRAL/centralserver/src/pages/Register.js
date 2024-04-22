import React, { useState } from "react";
import Header from "../components/Header";
import base from "./base"; // Importa la conexión a la base de datos

export default function Register() {
  // Define el estado para almacenar los datos del formulario
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(""); // Estado para el mensaje de resultado

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Ejecuta la consulta SQL para insertar un nuevo usuario
    const insertUserQuery = `
      INSERT INTO usuarios (username, password) 
      VALUES ('${username}', '${password}')
    `;

    // Ejecutar la consulta SQL
    base.query(insertUserQuery, (err, results, fields) => {
      if (err) {
        // Manejar el error
        console.error('Error al insertar usuario:', err);
        setMessage("Error al insertar usuario");
      } else {
        // Mostrar mensaje de éxito
        console.log('Usuario insertado exitosamente.');
        setMessage("Datos insertados correctamente");
      }
    });
  };

  return (
    <>
      <Header />
      <div className="containertitulo">
        <h1>Página de Registro</h1>
      </div>
      <div className="container">     
        <form onSubmit={handleSubmit}> {/* Formulario */}
          <div className="containerlogin">
            <div className="form-group">
              <label htmlFor="username">Usuario:</label>
              <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Registrar</button> {/* Botón de registro */}
          </div>
        </form>
        {/* Mostrar mensaje de resultado */}
        {message && <p>{message}</p>}
      </div>
      <div className="container">
        <h1>Habla luian</h1>
      </div>
    </>
  );
}
