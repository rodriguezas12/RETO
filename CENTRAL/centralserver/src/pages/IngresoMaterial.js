import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import Header from "../components/header";
import "./IngresoMaterial.css";



function Ingresomaterial() {
  const [data, setData] = useState([]);
  const [selectedStation, setSelectedStation] = useState('1');
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar el modo edición

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleCellClick = (rowIndex, columnIndex) => {
    if (!kitSeleccionado) return;
    const updatedCeldas = [...celdas];
    updatedCeldas[rowIndex][columnIndex] = kitSeleccionado;
    setCeldas(updatedCeldas);
  };

  const contarKits = () => {
    const conteo = {};
    celdas.flat().forEach((kit) => {
      if (kit) {
        conteo[kit] = (conteo[kit] || 0) + 1;
      }
    });
    return conteo;
  };

  const handleSubmit = async () => {
    const filasParaEnviar = celdas.map((row) => ({
      "Col1": row[0],
      "Col2": row[1],
      "Col3": row[2],
      "Col4": row[3],
      "Col5": row[4],
      "Col6": row[5],
      "Col7": row[6],
      "Col8": row[7],
      "Col9": row[8],
      "Col10": row[9],
    }));

  const fetchData = async (stationNumber) => {
    try {
      const response = await fetch(`http://localhost:5000/estaciones/${stationNumber}`);
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      console.log("Todas las solicitudes fueron realizadas con éxito");

      // Enviar datos del evento
      const conteoKits = contarKits();
      const descripcion = Object.entries(conteoKits).map(([kit, count]) => `Kit ${kit}: ${count}`).join(', ');
      const eventoData = {
        usuario: "NombreDelUsuario", // Reemplaza con la obtención correcta del nombre del usuario
        evento: "Ingreso material",
        descripcion: descripcion,
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().split(' ')[0]
      };

      const eventoResponse = await fetch("http://localhost:5000/eventosIngreso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventoData),
      });
      const eventoMessage = await eventoResponse.text();
      console.log("Respuesta del evento:", eventoMessage);

      setCeldas(Array(3).fill(null).map(() => Array(10).fill("")));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setIsEditing(e.target.checked); // Cambia el modo según el estado del checkbox

  };

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedData = data.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setData(updatedData);
  };

  const handleSaveChanges = () => {
    fetch('http://localhost:5000/guardarCambios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al guardar los cambios');
        }
        return response.json();
      })
      .then(updatedData => {
        console.log('Datos guardados:', updatedData);
      })
      .catch(error => {
        console.error('Error:', error);
      });

  };

  return (
    <div>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="Ingreso de material" />
      <div className="container-Ingreso">
        <div className="contenedor-labelingreso">
          <span className="elemento-labelingreso"></span>
          <input
            type="checkbox"
            id="checklist"
            className="custom-checkbox-estado"
            onChange={handleCheckboxChange} // Maneja el cambio en el checkbox
          />
          <span className="elemento-label"> Estado de Edición</span>
        </div>
        <div className="container-estacion" style={{ textAlign: 'left' }}>
          <span>Seleccione la estación de interés:</span>
          <select
            className="elemento-valor"
            value={selectedStation}
            onChange={handleStationChange}
          >
            <option value="1">Estación 1</option>
            <option value="2">Estación 2</option>
            <option value="3">Estación 3</option>
          </select>
          <button className="boton-ingreso"
            onClick={handleSaveChanges}>Guardar Cambios</button>
        </div>
      </div>
      <div className="container-ingreso">
        <div className="header">
          <div className="header-item">ID</div>
          <div className="header-item">Bahía</div>
        </div>
        {data.map((item, index) => (
          <div className="row" key={index}>
            <div className="cell">{item.id}</div>
            <div className="cell">
              <input
                type="text"
                name="bahia"
                value={item.bahia}
                onChange={(e) => handleInputChange(index, e)}
                placeholder={item.bahia}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
}
