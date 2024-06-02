import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import Header from "../components/header";
import "./IngresoMaterial.css";


function Ingresomaterial() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('http://localhost:5000/IDingreso')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        return response.json();
      })
      .then(data => {
        // Si los datos recibidos son un array de objetos con una propiedad 'ID'
        setData(data.map(item => ({ id: item.ID, bahia: '' })));
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  const [selectedStation, setSelectedStation] = useState('1');

  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  };


  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedData = data.map((item, i) =>
      i === index ? { ...item, [name]: value } : item
    );
    setData(updatedData);
  };

  const handleSaveChanges = () => {
    fetch('http://localhost:5000/Bahia/:ID', {
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
              />
            </div>
          </div>
        ))}
        <div className="container-estacion">
          <select value={selectedStation} onChange={handleStationChange}>
            <option value="1">Estación 1</option>
            <option value="2">Estación 2</option>
            <option value="3">Estación 3</option>
          </select>
          <button onClick={handleSaveChanges}>Guardar Cambios</button>
        </div>
      </div>
    </div>
  );
}

export default Ingresomaterial;

