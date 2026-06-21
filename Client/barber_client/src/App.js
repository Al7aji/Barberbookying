import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login welcomeMessage="Welcome to ElietBarber" />} />
          <Route path="/signup" element={<Signup welcomeMessage="Welcome to ElietBarber" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
