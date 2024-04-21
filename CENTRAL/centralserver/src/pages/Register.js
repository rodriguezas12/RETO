import Header from "../components/Header";

export default function Register() {
  return (
    <>
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
    </>
  );
}

