import { Formik } from "formik";
import { default as React, default as React, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import "./Register.css";

const Registro = () => {
  const [formularioEnviado, cambiarFormularioEnviado] = useState(false);
  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200..1000;1,200..1000&display=swap"
          rel="stylesheet"
        />
      </Helmet>

    <Formik
    initialValues={{
        nombre: '',
        codigo: '',
        nrc:''
    }}
    validate={(valores) => {
        let errores = {};

        // Validacion nombre
        if(!valores.nombre){
            errores.nombre = 'Por favor ingresa un nombre'
        } else if(!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(valores.nombre)){
            errores.nombre = 'El nombre solo puede contener letras y espacios'
        }

        // Validacion codigo estudiantil
        if(!valores.codigo){
            errores.codigo = 'Por favor ingresa un codigo estudiantil'
        } else if(!/^\d+$/.test(valores.codigo)){
            errores.codigo = 'El código solo puede contener letras, numeros, puntos, guiones y guion bajo.'
        }

        // Validacion NRC
        if(!valores.nrc){
            errores.nrc = 'Por favor ingresa un NRC correcto'
        } else if(!/^\d+$/.test(valores.nrc)){
            errores.nrc = 'El NRC solo puede contener letras, numeros, puntos, guiones y guion bajo.'
        }

        return errores;
    }}
    onSubmit={(valores, {resetForm}) => {
        resetForm();
        console.log('Formulario enviado');
        cambiarFormularioEnviado(true);
        setTimeout(() => cambiarFormularioEnviado(false), 5000);
    }}








      <form className="formualrio">
        <div>
          <h3 htmlFor="Nombre Completo">NombreCompleto</h3>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="Nombre Completo"
          />
        </div>
        <div>
          <h3 htmlFor="Nombre Completo">codigoEstudiantil</h3>
          <input
            type="number"
            id="nombre"
            name="codigo"
            placeholder="Codigo Estudiantil"
          />
        </div>
        <div>
          <h3 htmlFor="NRC Completo">NRC</h3>
          <input type="number" id="NRC" name="NRC" placeholder="NRC" />
        </div>
        <button type="submit">Registrar</button>
        <Link to="/">
          <button type="button">Volver</button>
        </Link>
      </form>
    </>
  );
};

export default Registro;
