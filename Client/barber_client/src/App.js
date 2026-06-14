import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login welcomeMessage="Welcome to ElietBarber" />} />
        <Route path="/signup" element={<Signup welcomeMessage="Welcome to ElietBarber" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
