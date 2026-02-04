import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3 shadow-sm">
      <div className="container-fluid">

        {/* Marca */}
        <Link className="navbar-brand fw-bold" to="/dashboard">
          Appadel
        </Link>

        {/* Botón responsive */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Contenido */}
        <div className="collapse navbar-collapse" id="navContent">

          {/* Izquierda */}
          <ul className="navbar-nav me-auto">

            {/* Inicio */}
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Inicio
              </Link>
            </li>

            {/* Reservar */}
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/reservar">
                  Reservar
                </Link>
              </li>
            )}

            {/* Mis reservas */}
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/mis-reservas">
                  Mis reservas
                </Link>
              </li>
            )}

            {/* Panel admin */}
            {user && user.role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Panel Admin
                </Link>
              </li>
            )}
          </ul>

          {/* Derecha */}
          <ul className="navbar-nav ms-auto">

            {/* Si NO está logueado */}
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Registro
                  </Link>
                </li>
              </>
            )}

            {/* Si está logueado */}
            {user && (
              <li className="nav-item">
                <button
                  className="btn btn-outline-light ms-2"
                  onClick={logout}
                >
                  Cerrar sesión
                </button>
              </li>
            )}
          </ul>

        </div>
      </div>
    </nav>
  );
}
