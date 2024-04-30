import axios from 'axios';
import React, { useEffect, useState } from "react";
import logo from '../Media/logo.png';
import './Estado.css'; // Asegúrate de que el archivo CSS está en la ubicación correcta y se llama Estado.css

export default function Estado() {
  const [kitArmados, setKitArmados] = useState('');
  const [productosArmados, setProductosArmados] = useState('');
  const [antena, setAntena] = useState('');

  useEffect(() => {
    getEstaciones(); // Llamar la función al montar el componente
  }, []);

  const getEstaciones = async () => {
    try {
      const response = await axios.get('http://localhost:3000/estaciones');
      setKitArmados(response.data.kitsArmados); // Asumiendo que la respuesta tiene una propiedad kitsArmados
      setProductosArmados(response.data.productosArmados); // Asumiendo que la respuesta tiene una propiedad productosArmados
    } catch (error) {
      console.error('Error al obtener los datos de las estaciones:', error);
    }
  };

  return (
    <div className="contenedor-gigante">
      <div id="banner">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Estado de producción</h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center' }}> {/* Añadir estilo en línea o crear una clase si prefieres */}
        <div id="kitsContainer">
          <h2>Kits armados:</h2>
          <p>{kitArmados}</p>
        </div>
        <div id="productosContainer">
          <h2>Productos ensamblados:</h2>
          <p>{productosArmados}</p>
        </div>
      </div>

      <div id="antenaContainer">
        <h3>Antena de interés</h3>
        <select value={antena} onChange={(e) => setAntena(e.target.value)}>
          {/* Las opciones podrían ser generadas dinámicamente si son muchas o cambian */}
          <option value="Entrada">Entrada</option>
          <option value="Salida">Salida</option>
          {/* ... más opciones */}
        </select>
      </div>

      <div id="tableContainer">
        <h4>Tabla de información</h4>
        {/* Aquí se mostraría la tabla con los datos, asegúrate de llamar a `getEstaciones` para obtenerlos */}
        <div id="datosEstaciones"></div>
      </div>

      <div id="returnButton">
        <button onClick={() => window.location.href='http://localhost:3001/Menu'}>Regresar</button>
      </div>
    </div>
  );
}
