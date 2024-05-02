import axios from "axios";
import React, { useEffect, useState } from "react";
import logo from "../Media/logo.png";
import "./Estado.css"; // Asegúrate de que el archivo CSS está en la ubicación correcta y se llama Estado.css

export default function Estado() {
  const [kitArmados, setKitArmados] = useState("");
  const [productosArmados, setProductosArmados] = useState("");
  const [antena, setAntena] = useState("");
  const numeroEstacion = 1;

  useEffect(() => {
    getEstaciones(numeroEstacion); // Llamar la función al montar el componente
  }, []);

  const getEstaciones = async (numeroEstacion) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/estaciones/${numeroEstacion}`
      );
      setKitArmados(response.data.kitsArmados);
      setProductosArmados(response.data.productosArmados);
    } catch (error) {
      console.error("Error al obtener los datos de las estaciones:", error);
    }
  };

  return (
    <div className="header-container">
      <img src={logo} alt="logo" className="logo" />
      <h1>INGRESO DE MATERIALES</h1>
      <button
        className="back-button"
        onClick={() => (window.location.href = "/Menu")}
      >
        Regresar al Menú
      </button>
    </div>
  );
}
