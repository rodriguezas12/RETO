import React from "react";
import Header from "../components/Header";

export default function Register() {
  return (
    <>
      <Header />
      <h2>Página de Registro</h2>
      <div>
        <label htmlFor="username">Usuario:</label>
        <input type="text" id="username" />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" />
      </div>
      <button>Comprobar</button>
    </>
  );
}
