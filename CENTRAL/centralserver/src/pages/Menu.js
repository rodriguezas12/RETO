import React from "react";
import { Link } from "react-router-dom";
import logo from "../Media/logo.png";
import "./Menu.css";

const Home = () => {
  return (
    <>
      <h2>Home Page</h2>
      <div className="login-box">
        <img src={logo} alt="Logo" />
        <h3>PORTAL DE GESTION INDUSTRIAL</h3>
        <div className="menu-buttons">
          <Link to="/solicitud">
            <button>Solicitud Pick to Light</button>
          </Link>
          <Link to="/estadodeprocesos">
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
