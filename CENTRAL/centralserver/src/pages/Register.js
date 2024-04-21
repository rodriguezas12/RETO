import Header from "../components/Header";
import './Register.css'; // Importamos el archivo CSS para aplicar estilos

export default function Register() {
  return (
    <div className="container"> {/* Agregamos una clase para el contenedor */}
      <Header />
      <h2>Pagina de registro</h2>
      <div>
        <label htmlFor="username">Usuario:</label>
        <input type="text" id="username" name="username" />
      </div>
      <div>
        <label htmlFor="password">Contraseña:</label>
        <input type="password" id="password" name="password" />
      </div>
      <div>
        <button onClick={handleClick}>Comprobar</button>
      </div>
    </div>
  );
}

function handleClick() {
  alert('Mensaje de alerta negativo');
}
