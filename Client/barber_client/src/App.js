import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";
import Booking from "./pages/Booking";
import Orders from "./pages/Orders";
import { BookingProvider } from "./context/BookingContext";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login welcomeMessage="Welcome to ElietBarber" />} />
              <Route path="/signup" element={<Signup welcomeMessage="Welcome to ElietBarber" />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/booking" element={<Booking />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </BookingProvider>
    </AuthProvider>
  );
}

export default App;
