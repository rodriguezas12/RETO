import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header"; // Ajusta la ruta según tu estructura
import "./Contenido.css"; // Archivo CSS para los estilos

function Contenido() {
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({ Contenido: "" });

  useEffect(() => {
    const fetchData = () => {
      fetch("http://localhost:5000/contenido")
        .then((response) => {
          if (!response.ok) {
            throw new Error("No se pudo obtener la respuesta del servidor");
          }
          return response.json();
        })
        .then((data) => {
          setData(data);
        })
        .catch((error) => console.error("Error:", error));
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleEditClick = (index, item) => {
    setEditIndex(index);
    setEditFormData({ Contenido: item.Contenido });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSaveClick = (index) => {
    const updatedData = data.map((item, i) =>
      i === index ? { ...item, Contenido: editFormData.Contenido } : item
    );
    setData(updatedData);
    setEditIndex(null);

    fetch(`http://localhost:5000/contenido1/${data[index].Kits}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ Contenido: editFormData.Contenido }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al actualizar los datos");
        }
        return response.json();
      })
      .then((updatedItem) => {
        setData((prevData) =>
          prevData.map((item) =>
            item.Kits === updatedItem.Kits ? updatedItem : item
          )
        );
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleAddRow = () => {
    const newKitNumber = data.length + 1;
    const newRow = { Kits: `Kit ${newKitNumber}`, Contenido: "" };

    fetch("http://localhost:5000/contenido1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRow),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error al agregar los datos");
        }
        return response.json();
      })
      .then((newItem) => {
        // Actualiza el estado de data con el nuevo elemento
        setData((prevData) => [...prevData, newItem]);
      })
      .catch((error) => console.error("Error:", error));
  };

  return (
    <div>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Header titulo="Asignación de contenido" />
      <div className="container-inventario">
        <button className="botton " onClick={handleAddRow}>
          Añadir Fila
        </button>
        <div className="table-contenido">
          <table>
            <thead>
              <tr>
                <th>Kits</th>
                <th>Contenido</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={index}>
                  <td>{item.Kits}</td>
                  <td>
                    {editIndex === index ? (
                      <input
                        type="text"
                        name="Contenido"
                        value={editFormData.Contenido}
                        onChange={handleEditFormChange}
                      />
                    ) : (
                      item.Contenido
                    )}
                  </td>
                  <td>
                    {editIndex === index ? (
                      <button
                        className="botton "
                        onClick={() => handleSaveClick(index)}
                      >
                        Guardar
                      </button>
                    ) : (
                      <button
                        className="botton "
                        onClick={() => handleEditClick(index, item)}
                      >
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Contenido;
