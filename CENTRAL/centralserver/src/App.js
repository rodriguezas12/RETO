import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Nopage from "../src/pages/Nopage";
import Register from "../src/pages/Register";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Nopage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
