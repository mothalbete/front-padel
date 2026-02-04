import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container mt-5" style={{ maxWidth: "900px" }}>
      {/* Encabezado */}
      <div className="text-center mb-5">
        <h2 className="fw-bold">Bienvenido, {user?.nombre}</h2>
        <p className="text-muted">Tu rol: {user?.role}</p>
      </div>

        <div className="row g-4 justify-content-center text-center">

        {/* Reservar pista */}
        <div className="col-md-4">
          <div
            className="card shadow-sm p-4 text-center"
            style={{ borderRadius: "14px" }}
          >
            <h4 className="fw-semibold text-primary mb-3">🎾 Reservar pista</h4>
            <Link className="btn btn-primary w-100 fw-semibold" to="/reservar">
              Ir a reservar
            </Link>
          </div>
        </div>

        {/* Ver mis reservas */}
        <div className="col-md-4">
          <div
            className="card shadow-sm p-4 text-center"
            style={{ borderRadius: "14px" }}
          >
            <h4 className="fw-semibold text-secondary mb-3">📅 Mis reservas</h4>
            <Link className="btn btn-secondary w-100 fw-semibold" to="/mis-reservas">
              Ver mis reservas
            </Link>
          </div>
        </div>

        {/* Opciones solo admin */}
        {user?.role === "admin" && (
          <>
            <div className="col-md-4">
              <div
                className="card shadow-sm p-4 text-center"
                style={{ borderRadius: "14px" }}
              >
                <h4 className="fw-semibold text-danger mb-3">🛠 Panel admin</h4>
                <Link className="btn btn-danger w-100 fw-semibold" to="/admin">
                  Entrar al panel
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card shadow-sm p-4 text-center"
                style={{ borderRadius: "14px" }}
              >
                <h4 className="fw-semibold text-warning mb-3">➕ Añadir pista</h4>
                <Link className="btn btn-warning w-100 fw-semibold" to="/admin/add-pista">
                  Añadir pista
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card shadow-sm p-4 text-center"
                style={{ borderRadius: "14px" }}
              >
                <h4 className="fw-semibold text-warning mb-3">🕒 Añadir horario</h4>
                <Link className="btn btn-warning w-100 fw-semibold" to="/admin/add-horario">
                  Añadir horario
                </Link>
              </div>
            </div>

            <div className="col-md-4">
              <div
                className="card shadow-sm p-4 text-center"
                style={{ borderRadius: "14px" }}
              >
                <h4 className="fw-semibold text-warning mb-3">👤 Añadir admin</h4>
                <Link className="btn btn-warning w-100 fw-semibold" to="/admin/add-admin">
                  Añadir admin
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
