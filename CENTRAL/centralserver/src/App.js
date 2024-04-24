import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../src/pages/Home";
import Nopage from "../src/pages/Nopage";
import Register from "../src/pages/Register";
import Login from "../src/pages/Login"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Nopage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
