import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import Header from "../components/header";
import "./Pick.css";

function Pick() {
  const [rfidText, setRfidText] = useState("");
  const [epValue, setEpValue] = useState("");
  const [pedidoRealizado, setPedidoRealizado] = useState([]);
  const [piezasPorVerificar, setPiezasPorVerificar] = useState([]);
  const [piezasVerificadas, setPiezasVerificadas] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [postCount, setPostCount] = useState(0);
  const [initialPedidoRealizado, setInitialPedidoRealizado] = useState([]);

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

  useEffect(() => {
    const fetchUltimoPedido = () => {
      fetch("http://localhost:5000/ultimoPedido")
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          const pedido = data.pedidoRealizado;
          if (pedido) {
            const kits = pedido.split(',').map(num => `Kit ${num}`);
            setPiezasPorVerificar(kits);
            setPedidoRealizado(kits);
            setPiezasVerificadas([]);
            if (initialPedidoRealizado.length === 0) {
              setInitialPedidoRealizado(kits);
            }
          }
        })
        .catch((error) => {
          console.error("There was an error with the fetch operation:", error);
        });
    };

    fetchUltimoPedido();
  }, []);

  useEffect(() => {
    let colorr;
    const interval = setInterval(() => {
      if (piezasPorVerificar.length > 0) {
        updatePiezas(colorr);
      }
    }, 2000); // Consulta cada 2 segundos

    return () => clearInterval(interval);
  }, [piezasPorVerificar]);

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
        const pedidoVerificado = data.pedidoRealizado.split(',').map(num => `Kit ${num}`);
        const kitsVerificados = piezasPorVerificar.filter(kit => !pedidoVerificado.includes(kit));
        setPiezasPorVerificar(pedidoVerificado);
        setPiezasVerificadas((prevState) => [...new Set([...prevState, ...kitsVerificados])]);

        if (data.descuentoPedido === "") {
          setPopupVisible(true);
        }

        // Incrementa el contador de POST
        setPostCount((prevCount) => prevCount + 1);
      })
      .catch((error) => {
        console.error("There was an error with the fetch operation:", error);
      });
  };

  const updatePiezas = (colorr) => {
    fetch("http://localhost:5000/ultimoPedido")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const pedido = data.pedidoRealizado;
        if (pedido) {
          const pedidoVerificado = pedido.split(',').map(num => `Kit ${num}`);
          const kitsVerificados = piezasPorVerificar.filter(kit => !pedidoVerificado.includes(kit));
          setPiezasPorVerificar(pedidoVerificado);
          setPiezasVerificadas((prevState) => [...new Set([...prevState, ...kitsVerificados])]);
          if (pedidoVerificado.length === 0) {
            setPopupVisible(true);
          }
        }
      })
      .catch((error) => {
        console.error("There was an error with the fetch operation:", error);
      });
  };

  const handleRfidTextChange = (event) => {
    const text = event.target.value.slice(0, 36);
    setRfidText(text);

    if (text.length === 36) {
      searchEP(text);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPedidoRealizado([]);
    setPiezasPorVerificar([]);
    setPiezasVerificadas([]);
    setPostCount(0);
    setInitialPedidoRealizado([]);
  };

  return (
    <div id="root">
      <Helmet>
        <link
          href="./Media/Nunito-Italic-VariableFont_wght.ttf"
          rel="stylesheet"
        />
      </Helmet>
      <div>
        <Header titulo="VERIFICACIÓN PICK TO LIGHT" />
        <div className="input-container">
          <h3 htmlFor="rfidText">Escanea el tag RFID:</h3>
          <textarea
            id="rfidText"
            className="textarea-pick"
            ref={textAreaRef}
            rows="2"
            cols="50"
            maxLength="36"
            value={rfidText}
            onChange={handleRfidTextChange}
          />
          <p>Último EP encontrado: {epValue}</p>
        </div>
        <div></div>
        <div className="status-container">
          <div className="status-box">
            <h3>Piezas por verificar:</h3>
            <p>{piezasPorVerificar.join(", ")}</p>
          </div>
          <div className="status-box">
            <h3>Piezas verificadas:</h3>
            <p>{piezasVerificadas.join(", ")}</p>
          </div>
        </div>
        {popupVisible && (
          <div className="popup">
            <div className="popup-content">
              <h2>PICK TO LIGHT COMPLETO</h2>
              <button onClick={closePopup}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Pick;
