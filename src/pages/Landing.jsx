import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Bienvenida a Padel App</h1>
      <p>Reserva tus pistas de pádel de forma rápida y sencilla.</p>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <Link to="/login">
          <button>Iniciar sesión</button>
        </Link>

        <Link to="/register">
          <button>Registrarse</button>
        </Link>
      </div>
    </div>
  );
}
