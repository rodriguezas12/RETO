<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
=======
import { BrowserRouter, Route, Routes } from "react-router-dom";
>>>>>>> 77b8f58b319a4df59cb9f2c5299cc830a763de5b
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Nopage from "../src/pages/Nopage";
import Register from "../src/pages/Register";
<<<<<<< HEAD

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
=======



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<Nopage />}/>
      </Routes>
    </BrowserRouter>
>>>>>>> 77b8f58b319a4df59cb9f2c5299cc830a763de5b
  );
}

export default App;
