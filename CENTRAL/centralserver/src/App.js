// App.js
import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Estado from "./pages/Estado";
import Home from "./pages/Home";
import IngresoMaterial from "./pages/IngresoMaterial";
import Inventario from "./pages/Inventario";
import Menu from "./pages/Menu";
import Nopage from "./pages/Nopage";
import Register from "./pages/Register";
import Solicitud from "./pages/Solicitud";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home setAuthenticated={setAuthenticated} />} />
        <Route path="/register" element={<Register />} />
        {authenticated ? (
          <>
            <Route path="/menu" element={<Menu />} />
            <Route path="/solicitud" element={<Solicitud />} />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/ingresomaterial" element={<IngresoMaterial />} />
            <Route path="/estado" element={<Estado />} />
          </>
        ) : (
          <Navigate to="/" replace />
        )}
        <Route path="*" element={<Nopage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
