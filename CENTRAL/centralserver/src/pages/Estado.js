import axios from "axios";
import React, { useEffect } from "react";
import Header from "../components/header";
import "./Estado.css";

export default function Estado() {
  const numeroEstacion = 1;

  useEffect(() => {
    getEstaciones(numeroEstacion); // Llamar la función al montar el componente
  }, []);

  const getEstaciones = async (numeroEstacion) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/estaciones/${numeroEstacion}`
      );
    } catch (error) {
      console.error("Error al obtener los datos de las estaciones:", error);
    }
  };

  return (
    <div style={{ marginTop: "15vh" }}>
      <Header titulo="SOLICITUD DE MATERIALES" />
    </div>
  );
}
