import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Estado from "./pages/Estado";
import Home from "./pages/Home";
import IngresoMaterial from "./pages/IngresoMaterial";
import Inventario from "./pages/Inventario";
import Menu from "./pages/Menu";
import Nopage from "./pages/Nopage";
import Register from "./pages/Register";
import Solicitud from "./pages/Solicitud";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/solicitud" element={<Solicitud />} />
        <Route path="/inventario" element={<Inventario />} />
        <Route path="/ingresomaterial" element={<IngresoMaterial />} />
        <Route path="/estadodeprocesos" element={<Estado />} />
        <Route path="*" element={<Nopage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
