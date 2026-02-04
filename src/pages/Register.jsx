import { useState } from "react";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, dni, password })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Error al registrarse");
      setOk("");
      return;
    }

    setOk("Usuario registrado correctamente");
    setError("");
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "420px", width: "100%", borderRadius: "14px" }}
      >
        <h2 className="text-center mb-4 fw-bold">Crear cuenta</h2>

        {/* Mensajes */}
        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {ok && (
          <div className="alert alert-success text-center">{ok}</div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Nombre */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

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
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}
