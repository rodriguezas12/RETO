import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet";
import logo from "../Media/logo.png"; // Importa la imagen

const Header = ({ titulo }) => {
  const [styles, setStyles] = useState({
    headerContainer: {
      position: "relative",
      width: "90vw",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
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
      fontSize: "4vh",
      color: "#8b4513",
      whiteSpace: "nowrap",
      fontFamily: "ChauPhilomeneOne-Regular",
      maxWidth: "60%",
    },
    backButton: {
      fontFamily: "Nunito",
      padding: "10px",
      backgroundColor: "#EB7D3D",
      color: "white",
      border: "none",
      borderRadius: "20px",
      boxShadow: "0 6px 6px 0 rgba(0, 0, 0, 0.5)",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.3s, box-shadow 0.3s",
      fontSize: "2.5vh",
      maxWidth: "200px",
      marginBottom: "10px",
      "&:hover": {
        backgroundColor: "#000000",
        boxShadow: "0 6px 12px 0 rgba(0, 0, 0, 0.5)",
      },
    },
    logo: {
      width: "auto",
      height: "80px",
    },
  });

  const handleResize = useCallback(() => {
    const newStyles = {
      ...styles,
      headerText: {
        ...styles.headerText,
        fontSize: window.innerWidth <= 600 ? "2vh" :
          window.innerWidth <= 768 ? "3vh" :
            window.innerWidth <= 1024 ? "3.5vh" : "4vh",
      },
      backButton: {
        ...styles.backButton,
        fontSize: window.innerWidth <= 600 ? "2vh" :
          window.innerWidth <= 768 ? "2.3vh" :
            window.innerWidth <= 1024 ? "2.5vh" : "2.5vh",
        padding: window.innerWidth <= 600 ? "8px" :
          window.innerWidth <= 768 ? "9px" :
            window.innerWidth <= 1024 ? "10px" : "10px",
        maxWidth: window.innerWidth <= 600 ? "150px" :
          window.innerWidth <= 768 ? "170px" :
            window.innerWidth <= 1024 ? "190px" : "200px",
      },
      logo: {
        ...styles.logo,
        height: window.innerWidth <= 600 ? "50px" :
          window.innerWidth <= 768 ? "60px" :
            window.innerWidth <= 1024 ? "70px" : "80px",
      },
    };

    setStyles(newStyles);
  }, [styles]);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const handleBackButtonClick = () => {
    window.history.back();
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
      <img src={logo} alt="logo" style={styles.logo} />
      <h1 style={styles.headerText}>{titulo}</h1>
      <button
        className="back-button"
        onClick={handleBackButtonClick}
        style={styles.backButton}
      >
        Regresar al Menú
      </button>
    </div>
  );
};

export default Header;