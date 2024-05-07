import React from "react";
import { Helmet } from "react-helmet";
import logo from "../Media/logo.png"; // Importa la imagen

const Header = ({ titulo }) => {
  const styles = {
    headerContainer: {
      position: "relative",
      width: "90vw", // Cambiado a 100% para ocupar todo el ancho
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between", // Cambiado a "space-between" para distribuir los elementos
      padding: "10px",
      margin: "10px",
      backgroundColor: "#FEFAF6",
      borderRadius: "20px",
      boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
    },
    headerText: {
      flex: "1",
      textAlign: "center",
      margin: "0",
      fontSize: "4vh", // Tamaño relativo al alto de la ventana
      color: "#8b4513",
      whiteSpace: "nowrap",
      fontFamily: "ChauPhilomeneOne-Regular",
      maxWidth: "60%", // Establece un ancho máximo para el texto
    },
    backButton: {
      fontFamily: "Nunito",
      padding: "10px",
      backgroundColor: "#EB7D3D",
      color: "white",
      border: "none",
      borderRadius: "20px",
      boxShadow: "0 4px 5px 0 rgba(0, 0, 0, 0.25)",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.3s",
      fontSize: "2.5vh", // Tamaño relativo al alto de la ventana
      maxWidth: "200px",
      marginBottom: "10px",
    },
    logo: {
      width: "auto", // Cambiado a "auto" para mantener la proporción de la imagen
      height: "80px", // Ajustado a una altura específica
    },
  };

  return (
    <div style={styles.headerContainer}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <img
        src={logo}
        alt="logo"
        style={styles.logo}
      />
      <h1 style={styles.headerText}>{titulo}</h1>
      <button
        className="back-button"
        onClick={() => (window.location.href = "/Menu")}
        style={styles.backButton}
      >
        Regresar al Menú
      </button>
    </div>
  );
};

export default Header;
