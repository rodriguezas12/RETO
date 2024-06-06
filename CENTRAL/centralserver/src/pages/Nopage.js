import React from "react";
import Helmet from "react-helmet";
import notFoundImage from "../Media/404.png"; // Importa la imagen
import Styles from "./Nopage.module.css"; // Importa los estilos CSS específicos para Nopage

export default function Nopage() {
  return (
    <>
      <Helmet>
        <title>ERROR 404</title>
        <meta
          name="description"
          content="No se encontró la página solicitada"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <div className={Styles.container}>
        <div className={Styles.textContainer}>
          <h1>NO PAGE FOUND</h1>
          <p>Lo sentimos, no se encontró la página que buscabas</p>
        </div>
        <div className={Styles.imageContainer}>
          <img src={notFoundImage} alt="Imagen asociada" />
        </div>
      </div>
    </>
  );
}
