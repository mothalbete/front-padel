import { useState } from "react";
import { apiFetch } from "../services/api";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ nombre, dni, password }),
      });

      setOk("Usuario registrado correctamente");
      setError("");
    } catch (err) {
      setError(err.data?.error || "Error al registrarse");
      setOk("");
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card shadow p-4" style={{ maxWidth: "420px", width: "100%", borderRadius: "14px" }}>
        <h2 className="text-center mb-4 fw-bold">Crear cuenta</h2>

        {error && <div className="alert alert-danger text-center">{error}</div>}
        {ok && <div className="alert alert-success text-center">{ok}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre</label>
            <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">DNI</label>
            <input type="text" className="form-control" value={dni} onChange={(e) => setDni(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Contraseña</label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button className="btn btn-primary w-100 py-2 fs-5 fw-semibold" type="submit">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
