import React from "react";
import Header from "../components/Header";
import "./Register.css"; // Importa el archivo CSS para estilos adicionales


export default function Register() {
  return (
    <>
      <Header />
      <div className="containertitulo">
        <h1>Página de Registro</h1>
      </div>
      <div className="container">     
        
          <div className="containerlogin">
            <div className="form-group">
              <label htmlFor="username">Usuario:</label>
              <input type="text" id="username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input type="password" id="password" />
            </div>
            <button>Comprobar</button>
          </div>
          <div className="containerlogin">
            <div className="form-group">
              <label htmlFor="username">Usuario:</label>
              <input type="text" id="username" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Contraseña:</label>
              <input type="password" id="password" />
            </div>
            <button>Comprobar</button>
          </div>
        
      </div>
      <div className="container">
        <h1>Habla luian</h1>
      </div>
    </>
  );
}
