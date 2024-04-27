import React, { useState } from "react";
import './Solicitud.css';
import logo from '../Media/logo.png';
import kit1 from '../Media/kit 1.png';
import kit2 from '../Media/kit 2.png';
import kit3 from '../Media/kit 3.png';
import kit4 from '../Media/kit 4.png';
import kit5 from '../Media/kit 5.png';
import kit6 from '../Media/kit 6.png';
import axios from 'axios';



export default function Picking() {
    const [pedido, setPedido] = useState([]);

    const añadirKit = (kitNumero) => {
        if (!pedido.includes(kitNumero)) {
            const nuevoPedido = [...pedido, kitNumero];
            setPedido(nuevoPedido);
            alert(`Kit ${kitNumero} añadido al carrito.\nPedido actual: ${nuevoPedido.join(', ')}`);
            console.log(nuevoPedido);
        }
    };

    const descontarKit = (kitNumero) => {
        const index = pedido.indexOf(kitNumero);
        if (index > -1) {
            const nuevoPedido = [...pedido];
            nuevoPedido.splice(index, 1);
            setPedido(nuevoPedido);
            alert(`Kit ${kitNumero} eliminado del carrito.\nPedido actual: ${nuevoPedido.join(', ')}`);
        }
    };

    const limpiarCarrito = () => {
        setPedido([]);
        alert('Carrito limpiado');
    };

    
    const solicitar = () => {
        if (pedido.length === 0) {
            alert('No hay kits en el carrito para solicitar.');
            return;
        }
    
        const data = {
            nuevoPedido: pedido.join(',') // asegúrate de que este es el formato que quieres en la base de datos
        };
    
        fetch('http://localhost:3000/solicitar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text(); // Cambiado de json() a text(), asumiendo que el servidor solo envía un mensaje de texto
        })
        .then(message => {
            alert('Solicitud realizada con éxito: ' + message);
            setPedido([]);
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
            alert('Error al realizar la solicitud: ' + error.message);
        });
    };
    
      
    


    // Arreglo de imágenes para facilitar la selección basada en el índice
    const kitImages = [kit1, kit2, kit3, kit4, kit5, kit6];

    return (
        <>
            <header className="header">
                <img src={logo} alt="Logo" className="logo" />
                <h1>SOLICITUD DE MATERIALES</h1>
            </header>
            <div className="container-items">
                {kitImages.map((image, index) => (
                    <div key={index} className="Kit">
                        <div className="info-product">
                            <div className="info-text">
                                <h2>Kit {index + 1}</h2>
                                <p>Disponibles:</p>
                            </div>
                            <div className="button-container">
                                <button className="button" onClick={() => añadirKit(index + 1)}>+</button>
                                <button className="button" onClick={() => descontarKit(index + 1)}>-</button>
                            </div>
                        </div>
                        <figure>
                            <img src={image} alt={`Icono del Kit ${index + 1}`} className="icono" />
                        </figure>
                    </div>
                ))}
            </div>
            <div className="button-panel">
                <button className="action-button" onClick={solicitar}>Solicitar</button>
                <button className="action-button" onClick={limpiarCarrito}>Limpiar carrito</button>
            </div>
        </>
    );
}










