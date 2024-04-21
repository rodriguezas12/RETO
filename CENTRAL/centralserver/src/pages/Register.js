import React, { useState } from "react";
import Header from "../components/Header";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleCheckButton = () => {
    alert("Comprobación de usuario y contraseña:");
    alert("Usuario: " + username);
    alert("Contraseña: " + password);
  };

  return (
    <>
      <Header />
      <h2>Página de Registro</h2>
      <div>
        <label htmlFor="username">Usuario:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>
      <button onClick={handleCheckButton}>Comprobar</button>
    </>
  );
}
