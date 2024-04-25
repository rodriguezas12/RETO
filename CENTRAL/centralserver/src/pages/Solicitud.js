import React, { useState } from "react";
import './Solicitud.css';
import logo from '../Media/logo.png';
import kit1 from '../Media/kit 1.png';
import kit2 from '../Media/kit 2.png';
import kit3 from '../Media/kit 3.png';
import kit4 from '../Media/kit 4.png';
import kit5 from '../Media/kit 5.png';
import kit6 from '../Media/kit 6.png';

export default function Picking() {
    const [pedido, setPedido] = useState([]);

    const añadirKit = (kitNumero) => {
        if (!pedido.includes(kitNumero)) {
            const nuevoPedido = [...pedido, kitNumero];
            setPedido(nuevoPedido);
            alert(`Kit ${kitNumero} añadido al carrito.\nPedido actual: ${nuevoPedido.join(', ')}`);
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
        </>
    );
}










