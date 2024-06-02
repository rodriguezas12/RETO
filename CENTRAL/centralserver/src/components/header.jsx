import React, { useEffect, useLayoutEffect, useState } from "react";
import { Helmet } from "react-helmet";
import logo from "../Media/logo.png"; // Importa la imagen

const Header = ({ titulo }) => {
  const [fontSize, setFontSize] = useState("4vh");
  const [backButtonStyles, setBackButtonStyles] = useState({
    fontFamily: "Nunito",
    padding: "10px",
    backgroundColor: "#EB7D3D",
    color: "white",
    border: "none",
    borderRadius: "10px",
    boxShadow: "0 6px 6px 0 rgba(0, 0, 0, 0.5)",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.3s, box-shadow 0.3s",
    fontSize: "2vh",
    maxWidth: "200px",
    marginBottom: "10px",
  });
  const [logoStyles, setLogoStyles] = useState({
    width: "auto",
    height: "70px",
  });

  const handleResize = () => {
    setFontSize(
      window.innerWidth <= 600
        ? "2vh"
        : window.innerWidth <= 768
        ? "2vh"
        : window.innerWidth <= 1024
        ? "3.5vh"
        : "4vh"
    );

    setBackButtonStyles({
      fontFamily: "Nunito",
      padding:
        window.innerWidth <= 600
          ? "8px"
          : window.innerWidth <= 768
          ? "9px"
          : window.innerWidth <= 1024
          ? "10px"
          : "10px",
      backgroundColor: "#ff4500",
      color: "white",
      border: "none",
      borderRadius: "10px",
      boxShadow: "0 6px 6px 0 rgba(0, 0, 0, 0.5)",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.3s, box-shadow 0.3s",
      fontSize:
        window.innerWidth <= 600
          ? "2.5vh"
          : window.innerWidth <= 768
          ? "2.8vh"
          : window.innerWidth <= 1024
          ? "2.5vh"
          : "2.5vh",
      maxWidth:
        window.innerWidth <= 600
          ? "150px"
          : window.innerWidth <= 768
          ? "170px"
          : window.innerWidth <= 1024
          ? "190px"
          : "200px",
      marginBottom: "10px",
    });

    setLogoStyles({
      width: "auto",
      height:
        window.innerWidth <= 600
          ? "40px"
          : window.innerWidth <= 768
          ? "50px"
          : window.innerWidth <= 1024
          ? "60px"
          : "70px",
    });
  };

  // useEffect se ejecuta después del renderizado
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // [] para ejecutar solo una vez al montar y desmontar

  // useLayoutEffect se ejecuta antes del renderizado
  useLayoutEffect(() => {
    handleResize();
  }, []); // [] para ejecutar solo una vez al montar

  const handleBackButtonClick = () => {
    window.history.back();
  };

  return (
    <div
      style={{
        position: "relative",
        width: "90vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px",
        margin: "10px",
        backgroundColor: "#FEFAF6",
        borderRadius: "10px",
        boxShadow: "0 4px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Helmet>
        
      </Helmet>
      <img src={logo} alt="logo" style={logoStyles} />
      <h1
        style={{
          flex: "1",
          textAlign: "center",
          margin: "0",
          fontSize: fontSize,
          color: "#8b4513",
          whiteSpace: "nowrap",
          fontFamily: "ChauPhilomeneOne-Regular",
          maxWidth: "60%",
        }}
      >
        {titulo}
      </h1>
      <button
        className="back-button"
        onClick={handleBackButtonClick}
        style={backButtonStyles}
      >
        Regresar al Menú
      </button>
    </div>
  );
};

export default Header;
