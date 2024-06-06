


// App.js
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import '../src/components/Popup.css'; // Asegúrate de tener los estilos para el popup
import Asignacion from "./pages/Asignacion";
import Contenido from "./pages/Contenido";
import Estado from "./pages/Estado";
import Eventos from "./pages/Eventos";
import Home from "./pages/Home";
import IngresoMaterial from "./pages/IngresoMaterial";
import Inventario from "./pages/Inventario";
import Menu from "./pages/Menu";
import Nopage from "./pages/Nopage";
import Pick from "./pages/Pick";
import Pick2 from "./pages/Pick2";
import Register from "./pages/Register";
import Solicitud from "./pages/Solicitud";

function PrivateRoute({ element, isAuthenticated, showPopup, message }) {
  return isAuthenticated ? (
    <>
      {showPopup && <Popup show={showPopup} message={message} />}
      {element}
    </>
  ) : (
    <Navigate to="/" replace />
  );
}

const Popup = ({ show, message }) => {
  return show ? (
    <div className="popup">
      <div className="popup-inner">
        <h2>{message}</h2>
      </div>
    </div>
  ) : null;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Home setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/menu"
          element={
            <PrivateRoute
              element={<Menu />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/solicitud"
          element={
            <PrivateRoute
              element={<Solicitud />}
              isAuthenticated={isAuthenticated}
              showPopup={showPopup}
              message="Tiempo excedido. Por favor, revise el sistema."
            />
          }
        />
        <Route
          path="/inventario"
          element={
            <PrivateRoute
              element={<Inventario />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/ingresomaterial"
          element={
            <PrivateRoute
              element={<IngresoMaterial />}
              isAuthenticated={isAuthenticated}
              showPopup={showPopup}
              message="Tiempo excedido. Por favor, revise el sistema."
            />
          }
        />
        <Route
          path="/contenido"
          element={
            <PrivateRoute
              element={<Contenido />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route
          path="/estado"
          element={
            <PrivateRoute
              element={<Estado />}
              isAuthenticated={isAuthenticated}
            />
          }
        />
        <Route path="/eventos" element={<Eventos />} />
        <Route path="/asignacion" element={<Asignacion />} />
        <Route path="/pick" element={<Pick />} />
        <Route path="/pick2" element={<Pick2 />} />
        <Route path="*" element={<Nopage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
