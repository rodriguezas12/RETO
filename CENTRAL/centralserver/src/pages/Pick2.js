import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import "./Pick.css";
import axios from 'axios';

function Pick2() {
    const [rfidText, setRfidText] = useState("");
    const [epValue, setEpValue] = useState("");


    const textAreaRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRfidText("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [epValue]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (textAreaRef.current) {
                textAreaRef.current.focus();
            }
        }, 6100);

        return () => clearInterval(interval);
    }, []);





    const searchEP = (text) => {
        const regex = /EP:\s*([A-Z0-9]+)/;
        const match = text.match(regex);
        if (match) {
            setEpValue(match[1]);
            updateInv(match[1]);
        } else {
            setEpValue("");
        }
    };

    const updateInv = (ep) => {
        fetch("http://localhost:5000/actualizarINV", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ EP: ep }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                // Manejar los datos de la respuesta
                console.log("Respuesta del servidor:", data);
                // Aquí puedes agregar cualquier lógica adicional para manejar la respuesta
            })
            .catch((error) => {
                console.error("Hubo un problema con la solicitud fetch:", error);
                // Manejar el error, por ejemplo, mostrar un mensaje al usuario
            });
    };
    

    const handleRfidTextChange = (event) => {
        const text = event.target.value.slice(0, 36);
        setRfidText(text);

        if (text.length === 36) {
            searchEP(text);
        }
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
            <Header titulo="Verificación de ingreso de material " />
            <div className="input-container">
                <label htmlFor="rfidText">Ingresa el texto RFID (máx. 36 caracteres):</label>
                <textarea
                    id="rfidText"
                    ref={textAreaRef}
                    rows="4"
                    cols="50"
                    maxLength="36"
                    value={rfidText}
                    onChange={handleRfidTextChange}
                />
            </div>
            <div className="ep-value-display">
                <p>Último EP encontrado: {epValue}</p>



            </div>
        </div>
    );
}

export default Pick2;
