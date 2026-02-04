import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ReservarPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [pistas, setPistas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [extras, setExtras] = useState([]);

  const [pistaId, setPistaId] = useState("");
  const [horarioId, setHorarioId] = useState("");
  const [fecha, setFecha] = useState("");

  const [ocupados, setOcupados] = useState([]); // ← NUEVO
  const [extraHorario, setExtraHorario] = useState(null);
  const [mensaje, setMensaje] = useState("");

  // ============================================================
  // Cargar datos iniciales
  // ============================================================
  useEffect(() => {
    fetch("http://localhost:5000/pistas")
      .then((res) => res.json())
      .then((data) => setPistas(data));

    fetch("http://localhost:5000/horarios")
      .then((res) => res.json())
      .then((data) => setHorarios(data));

    fetch("http://localhost:5000/extras")
      .then((res) => res.json())
      .then((data) => setExtras(data));
  }, []);

  // ============================================================
  // Cargar horarios ocupados cuando cambian pista o fecha
  // ============================================================
  useEffect(() => {
    if (!pistaId || !fecha) return;

    fetch(
      `http://localhost:5000/reservas/disponibilidad?pista_id=${pistaId}&fecha=${fecha}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => setOcupados(data.ocupados || []));
  }, [pistaId, fecha, token]);

  // ============================================================
  // Calcular extra según turno
  // ============================================================
  useEffect(() => {
    if (!horarioId) return setExtraHorario(null);

    const horario = horarios.find((h) => h.id == horarioId);
    if (!horario) return setExtraHorario(null);

    const extra = extras.find((e) =>
      e.nombre.toLowerCase().includes(horario.turno.toLowerCase())
    );

    setExtraHorario(extra || null);
  }, [horarioId, horarios, extras]);

  // ============================================================
  // Cálculo de precios
  // ============================================================
  const pistaSeleccionada = pistas.find((p) => p.id == pistaId);
  const precioPista = pistaSeleccionada ? Number(pistaSeleccionada.precio_base) : 0;
  const precioExtra = extraHorario ? Number(extraHorario.cantidad_extra) : 0;
  const precioTotal = precioPista + precioExtra;

  // ============================================================
  // Crear reserva
  // ============================================================
  const reservar = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/reservas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        pista_id: pistaId,
        fecha: fecha,
        horarios: [horarioId],
      }),
    });

    const data = await res.json();

    // Si el backend detecta solapamiento
    if (res.status === 409) {
      setMensaje("Esta pista ya está reservada en ese horario");
      return;
    }

    if (!res.ok) {
      setMensaje(data.error || "Error al crear la reserva");
      return;
    }

    setMensaje("Reserva creada correctamente");
    setTimeout(() => navigate("/dashboard"), 1000);
  };

  // ============================================================
  // Render
  // ============================================================
  return (
    <div className="container d-flex justify-content-center mt-5">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "500px", width: "100%", borderRadius: "14px" }}
      >
        <h2 className="text-center mb-4 fw-bold">Reservar pista</h2>

        {mensaje && <div className="alert alert-info text-center">{mensaje}</div>}

        <form onSubmit={reservar}>
          {/* Pista */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Pista</label>
            <select
              className="form-select"
              value={pistaId}
              onChange={(e) => setPistaId(e.target.value)}
              required
            >
              <option value="">Selecciona una pista</option>
              {pistas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — {p.precio_base}€
                </option>
              ))}
            </select>
          </div>

          {/* Fecha */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Fecha</label>
            <input
              type="date"
              className="form-control"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </div>

          {/* Horario */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Horario</label>
            <select
              className="form-select"
              value={horarioId}
              onChange={(e) => setHorarioId(e.target.value)}
              required
            >
              <option value="">Selecciona un horario</option>
              {horarios.map((h) => (
                <option
                  key={h.id}
                  value={h.id}
                  disabled={ocupados.includes(h.id)}
                >
                  {h.franja} — {h.turno}{" "}
                  {ocupados.includes(h.id) && "(ocupado)"}
                </option>
              ))}
            </select>
          </div>

          {/* Desglose */}
          <div className="desglose-box mb-3">
            <h5>Desglose del precio</h5>

            <p>Pista: {precioPista}€</p>

            {extraHorario && <p>{extraHorario.nombre}: {precioExtra}€</p>}

            <hr />

            <h4 className="text-success fw-bold">Total: {precioTotal}€</h4>
          </div>

          {/* Botón */}
          <button className="btn btn-primary btn-reservar w-100" type="submit">
            Reservar por {precioTotal}€
          </button>
        </form>
      </div>
    </div>
  );
}
