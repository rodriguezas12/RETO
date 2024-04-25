import React from 'react';
import './Header.css'; // Importa los estilos CSS para el encabezado
const Header = ({ imageUrl, text }) => {
  return (
    <header className="header">
      <img src={imageUrl} alt="Logo" className="header-image" />
      <h1 className="header-text">{text}</h1>
    </header>




  );
}

export default Header;
