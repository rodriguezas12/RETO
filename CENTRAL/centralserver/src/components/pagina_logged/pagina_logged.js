import React from 'react';
import Casal from '../casal/casal'; // Ajusta la ruta de importación según la ubicación real del archivo
import InicioSeccion from '../inicio_seccion/inicio_seccion'; // Ajusta la ruta de importación según la ubicación real del archivo

function parsejwt(token){
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c){
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const token = localStorage.getItem('token');

let tokenIsStillValid = false;

if (token) {
  const tokenExpirationTime = parsejwt(token).exp * 1000;
  const currentTime = Date.now();
  tokenIsStillValid = tokenExpirationTime > currentTime;
}

const pagina_logged = () => {
  return (
    <>
      {tokenIsStillValid ? <Casal /> : <InicioSeccion />}
    </>
  );
}

export default pagina_logged;
