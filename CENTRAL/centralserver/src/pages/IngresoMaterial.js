import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "../components/header";
import "./IngresoMaterial.css";

function Ingresomaterial() {
  const [data, setData] = useState([]);
  const [selectedStation, setSelectedStation] = useState("1");
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar el modo edición

  const GenerarM1 = async () => {
    try {
      // Realizar la solicitud al endpoint para obtener los datos
      const response = await fetch("http://localhost:5000/getm1");
      if (!response.ok) {
        throw new Error("Error al obtener los datos de la tabla DATOS");
      }

      const results = await response.json();

      // Matriz para guardar los datos transformados
      const matrizOriginal = [[], []];

      // Función para extraer solo el número del texto si es una cadena
      const extractNumber = (text) => {
        if (typeof text === "string") {
          const match = text.match(/\d+/); // Busca el primer número en el texto
          return match ? match[0] : text; // Si encuentra un número, lo devuelve, de lo contrario devuelve el texto original
        }
        return text; // Si no es una cadena, devuelve el valor original
      };

      // Recorrer los resultados y transformar los valores
      results.forEach((row) => {
        matrizOriginal[0].push(extractNumber(row.Nombre));
        matrizOriginal[1].push(extractNumber(row.Bahia));
      });

      console.log(matrizOriginal);

      // Función para ordenar los datos en una nueva matriz 3x10
      const ordenarMatriz = (matriz) => {
        const nuevaMatriz = Array.from({ length: 3 }, () => Array(10).fill(""));

        // Recorrer la matriz original y colocar los datos en la nueva matriz
        for (let i = 0; i < matriz[0].length; i++) {
          const nombre = matriz[0][i];
          const bahia = matriz[1][i]; // Ajustar bahía para índice 0

          // Calcular la posición en la nueva matriz
          const fila = Math.floor(bahia / 10);
          const columna = bahia % 10;

          // Concatenar los valores con comas si ya existe un valor en esa posición
          if (nuevaMatriz[fila][columna]) {
            nuevaMatriz[fila][columna] += `,${nombre}`;
          } else {
            nuevaMatriz[fila][columna] = nombre;
          }
        }

        return nuevaMatriz;
      };

      // Llamar a la función para ordenar la matriz
      const matrizOrdenada = ordenarMatriz(matrizOriginal);
      console.log("Matriz ordenada:", matrizOrdenada);

      try {
        const saveResponse = await fetch("http://10.20.5.134:5000/saveM1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ matriz: matrizOrdenada }), // Asegúrate de tener 'matrizOrdenada' definida aquí
        });

        if (!saveResponse.ok) {
          throw new Error("Error al guardar la matriz en la base de datos");
        }
        console.log("Matriz guardada exitosamente");

      } catch (error) {
        console.error("Error al guardar la matriz en la base de datos:", error);
      }
    } catch (error) {
      console.error("Error al generar la matriz M1:", error);
    }
  };

  useEffect(() => {
    // Llamar a la función para generar la matriz
    GenerarM1();
  }, []); // Se ejecutará solo una vez cuando el componente se monte

  useEffect(() => {
    // Llamar a la función para crear la tabla cuando el componente se monte
    createTable();

    if (!isEditing) {
      fetchData(selectedStation);
      const interval = setInterval(() => fetchData(selectedStation), 2000); // Actualiza cada 5 segundos
      return () => clearInterval(interval); // Limpia el intervalo al desmontar el componente o cambiar el modo
    }
  }, [selectedStation, isEditing]);

  // Crear la tabla cuando el componente se monte
  const createTable = async () => {
    try {
      const response = await fetch("http://localhost:5000/createTableM1", {
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
      GenerarM1();
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
            <option value="4">Estación 4</option>
            <option value="5">Estación 5</option>
            <option value="6">Estación 6</option>
            <option value="7">Estación 7</option>
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