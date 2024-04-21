import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Nopage from "../src/pages/Nopage";
import Register from "../src/pages/Register";
import base from "../src/pages/base";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/base" element={<base />} />
        <Route path="/*" element={<Nopage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

