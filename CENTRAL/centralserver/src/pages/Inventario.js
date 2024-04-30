import React from "react";


export default function Inventario() {
    return (
      <>
      <button className="back-button" onClick={() =>
      window.location.href = '/Menu'}>Regresar al Menú</button>
        <h1>davo</h1>
        <h2>Bienvenido mi papá</h2> {/* Usar el componente PaginaLogged */}
      </>
    );
}
