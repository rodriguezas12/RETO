import React from "react";


export default function Estado() {
    return (
      <>
        <button className="back-button" onClick={() =>
        window.location.href = '/Menu'}>Regresar al Menú</button>
        <h1>davo</h1>
        <h2>Bienvenido, estas correctamente loogeado</h2> {/* Usar el componente PaginaLogged */}
      </>
    );
}
