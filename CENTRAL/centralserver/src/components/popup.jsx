import React, { useEffect } from "react";
import './Popup.css'; // Importa los estilos CSS

const Popup = ({ mensaje, showPopup, setShowPopup }) => {
  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000); // Tiempo en milisegundos (3000ms = 3 segundos)

      return () => clearTimeout(timer); // Limpiar el timer si el componente se desmonta o si showPopup cambia
    }
  }, [showPopup, setShowPopup]);

  if (!showPopup) return null;

  return (
    <div className="popup-juanito">
      <p>{mensaje}</p>
    </div>
  );
};

export default Popup;
