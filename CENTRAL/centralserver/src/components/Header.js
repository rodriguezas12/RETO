import logo from "../Media/logo.png"; // Importa la imagen del logo desde su ubicación
import Styles from "./Header.module.css";

export default function Header() {
  return (
    <div className={Styles.banner}>
      <img src={logo} alt="Logo" className={Styles.logo} /> {/* Elemento de logo */}
      <h1 className={Styles.title}>Header: React xd</h1> {/* Título del banner */}
    </div>
  );
}