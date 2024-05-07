import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import logo from "../Media/logo.png";
import "./Menu.css";

const Home = () => {
  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className="menu-box">
        <img src={logo} alt="Logo" />
        <h3>PORTAL DE GESTION INDUSTRIAL</h3>
        <div className="menu-buttons">
          <Link to="/solicitud">
            <button>Solicitud Pick to Light</button>
          </Link>
          <Link to="/estado">
            <button>Estado de procesos</button>
          </Link>
          <Link to="/inventario">
            <button>Inventario</button>
          </Link>
          <Link to="/ingresomaterial">
            <button>Ingreso de Material</button>
          </Link>
          <Link to="/">
            <button>Regresar</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;