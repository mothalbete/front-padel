import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ok = await login(dni, password);

    if (ok) {
      navigate("/dashboard");
      return;
    }

    setError("DNI o contraseña incorrectos");
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "14px" }}
      >
        <h2 className="text-center mb-4 fw-bold">Iniciar sesión</h2>

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* DNI */}
          <div className="mb-3">
            <label className="form-label fw-semibold">DNI</label>
            <input
              type="text"
              className="form-control"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Botón */}
          <button
            className="btn btn-primary w-100 py-2 fs-5 fw-semibold"
            type="submit"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
