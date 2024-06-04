import React, { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Estado from "./pages/Estado";
import Eventos from "./pages/Eventos";
import Home from "./pages/Home";
import IngresoMaterial from "./pages/IngresoMaterial";
import Inventario from "./pages/Inventario";
import Menu from "./pages/Menu";
import Nopage from "./pages/Nopage";
import Register from "./pages/Register";
import Solicitud from "./pages/Solicitud";
import Asignacion from "./pages/Asignacion";
import Contenido from "./pages/Contenido";
import Pick from "./pages/Pick"

import Pick2 from "./pages/Pick2";

function PrivateRoute({ element, isAuthenticated }) {
  return isAuthenticated ? element : <Navigate to="/" replace />;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
}

export default App;
