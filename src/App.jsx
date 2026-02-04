import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Dashboard from "./pages/Dashboard";
import MisReservas from "./pages/MisReservas";
import "./App.css";

// Ejemplos de páginas protegidas
import ReservarPage from "./pages/ReservarPage";
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        


      < Route
        path="/mis-reservas"
        element={
          <ProtectedRoute>
            <MisReservas />
          </ProtectedRoute>
        }
      />


        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Rutas protegidas normales */}
        <Route
          path="/reservar"
          element={
            <ProtectedRoute>
              <ReservarPage />
            </ProtectedRoute>
          }
        />

        {/* Rutas solo para admin */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
