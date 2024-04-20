import { BrowserRouter, Routes } from "react-router-dom";
import { Home } from "../src/pages";
import Login from "./pages/Login";
import Nopage from "./pages/Nopage";
import Register from "./pages/Register";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <route index element={<Home />} />
          <route path="/home" element={<Home />} />
          <route path="/login" element={<Login />} />
          <route path="/register" element={<Register />} />
          <route path="*" element={<Nopage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
