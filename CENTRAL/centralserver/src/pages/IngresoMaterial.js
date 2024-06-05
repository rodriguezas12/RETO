import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "../components/header";
import "./IngresoMaterial.css";

function Ingresomaterial() {
  const [data, setData] = useState([]);
  const [selectedStation, setSelectedStation] = useState("1");
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar el modo edición

  useEffect(() => {
    const GenerarM1 = async () => {
      try {
        // Realizar la solicitud al endpoint para obtener los datos
        const response = await fetch("http://localhost:5000/getm1");
        if (!response.ok) {
          throw new Error("Error al obtener los datos de la tabla DATOS");
        }

        const results = await response.json();

        // Matriz para guardar los datos transformados
        const matriz = [[], []];

        // Función para extraer solo el número del texto
        const extractNumber = text => {
          const match = text.match(/\d+/); // Busca el primer número en el texto
          return match ? match[0] : text; // Si encuentra un número, lo devuelve, de lo contrario devuelve el texto original
        };

        // Recorrer los resultados y transformar los valores
        results.forEach(row => {
          matriz[0].push(extractNumber(row.Nombre));
          matriz[1].push(extractNumber(row.Bahia));
        });

        console.log(matriz);

      } catch (error) {
        console.error("Error al generar la matriz M1:", error);
      }
    };

    // Llamar a la función para generar la matriz
    GenerarM1();

  }, []); // Se ejecutará solo una vez cuando el componente se monte





  useEffect(() => {
    createTable();

    if (!isEditing) {
      fetchData(selectedStation);
      const interval = setInterval(() => fetchData(selectedStation), 2000); // Actualiza cada 5 segundos
      return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente o cambiar el modo
    }
  }, [selectedStation, isEditing]);

  useEffect(() => {
    createTable();

    if (!isEditing) {
      fetchData(selectedStation);
      const interval = setInterval(() => fetchData(selectedStation), 2000); // Actualiza cada 2 segundos
      return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente o cambiar el modo
    }
  }, [selectedStation, isEditing]);

  
  // Crear la tabla cuando el componente se monte
  const createTable = async () => {
    try {
      const response = await fetch("http://localhost:5000/tableM1", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Error al crear la tabla");
      }
      console.log("Tabla 'M1' creada o ya existe");
    } catch (error) {
      console.error("Error al crear la tabla:", error);
    }
  };

  const fetchData = async (stationNumber) => {
    try {
      const response = await fetch(
        `http://localhost:5000/estaciones/${stationNumber}`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const result = await response.json();
      setData(result.map((item) => ({ id: item.ID, bahia: item.Bahia || "" })));
    } catch (error) {
      console.error("Error:", error);
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
    fetch("http://localhost:5000/guardarCambios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al guardar los cambios");
        }
        return response.json();
      })
      .then((updatedData) => {
        console.log("Datos guardados:", updatedData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <Helmet>
        <link
          href="./Media/Nunito-Italic-VariableFont_wght.ttf"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="Ingreso de material" />
      <div className="container-Ingreso">
        <div className="container-estacion" style={{ textAlign: "left" }}>
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
          <Link to="/pick2">
            <button className="boton-ingreso" onClick={handleSaveChanges}>
              Guardar Cambios
            </button>
          </Link>
        </div>
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

export default Ingresomaterial;
