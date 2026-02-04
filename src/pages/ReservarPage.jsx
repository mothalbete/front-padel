import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../services/api";

export default function ReservarPage() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [pistas, setPistas] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [extras, setExtras] = useState([]);

  const [pistaId, setPistaId] = useState("");
  const [horarioId, setHorarioId] = useState("");
  const [fecha, setFecha] = useState("");

  const [ocupados, setOcupados] = useState([]);
  const [extraHorario, setExtraHorario] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    apiFetch("/pistas").then(setPistas);
    apiFetch("/horarios").then(setHorarios);
    apiFetch("/extras").then(setExtras);
  }, []);

  useEffect(() => {
    if (!pistaId || !fecha) return;

    apiFetch(
      `/reservas/disponibilidad?pista_id=${pistaId}&fecha=${fecha}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((data) => setOcupados(data.ocupados || []))
      .catch(() => setOcupados([]));
  }, [pistaId, fecha, token]);

  const horario = horarios.find((h) => h.id == horarioId);
  useEffect(() => {
    if (!horario) return setExtraHorario(null);

    const extra = extras.find((e) =>
      e.nombre.toLowerCase().includes(horario.turno.toLowerCase())
    );

    setExtraHorario(extra || null);
  }, [horarioId, horarios, extras]);

  const pistaSeleccionada = pistas.find((p) => p.id == pistaId);
  const precioPista = pistaSeleccionada ? Number(pistaSeleccionada.precio_base) : 0;
  const precioExtra = extraHorario ? Number(extraHorario.cantidad_extra) : 0;
  const precioTotal = precioPista + precioExtra;

  const reservar = async (e) => {
    e.preventDefault();

    try {
      await apiFetch("/reservas", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          pista_id: pistaId,
          fecha,
          horarios: [horarioId],
        }),
      });

      setMensaje("Reserva creada correctamente");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      if (err.status === 409) {
        setMensaje("Esta pista ya está reservada en ese horario");
      } else {
        setMensaje(err.data?.error || "Error al crear la reserva");
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center mt-5">
      <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%", borderRadius: "14px" }}>
        <h2 className="text-center mb-4 fw-bold">Reservar pista</h2>

        {mensaje && <div className="alert alert-info text-center">{mensaje}</div>}

        <form onSubmit={reservar}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Pista</label>
            <select className="form-select" value={pistaId} onChange={(e) => setPistaId(e.target.value)} required>
              <option value="">Selecciona una pista</option>
              {pistas.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} — {p.precio_base}€
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Fecha</label>
            <input type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Horario</label>
            <select className="form-select" value={horarioId} onChange={(e) => setHorarioId(e.target.value)} required>
              <option value="">Selecciona un horario</option>
              {horarios.map((h) => (
                <option key={h.id} value={h.id} disabled={ocupados.includes(h.id)}>
                  {h.franja} — {h.turno} {ocupados.includes(h.id) && "(ocupado)"}
                </option>
              ))}
            </select>
          </div>

          <div className="desglose-box mb-3">
            <h5>Desglose del precio</h5>
            <p>Pista: {precioPista}€</p>
            {extraHorario && <p>{extraHorario.nombre}: {precioExtra}€</p>}
            <hr />
            <h4 className="text-success fw-bold">Total: {precioTotal}€</h4>
          </div>

          <button className="btn btn-primary btn-reservar w-100" type="submit">
            Reservar por {precioTotal}€
          </button>
        </form>
      </div>
    </div>
  );
}
