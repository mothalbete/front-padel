import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function MisReservas() {
  const { token } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const cargarReservas = async () => {
    const res = await fetch("http://localhost:5000/reservas", {
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      setMensaje(data.error || "Error al cargar reservas");
      return;
    }

    setReservas(data);
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const cancelarReserva = async (id) => {
    if (!confirm("¿Seguro que quieres cancelar esta reserva?")) return;

    const res = await fetch(`http://localhost:5000/reservas/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await res.json();

    if (!res.ok) {
      setMensaje(data.error || "Error al cancelar la reserva");
      return;
    }

    setMensaje("Reserva cancelada correctamente");
    cargarReservas();
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "800px" }}>
      <h2 className="text-center mb-4 fw-bold">Mis reservas</h2>

      {mensaje && <div className="alert alert-info text-center">{mensaje}</div>}

      {reservas.length === 0 && (
        <p className="text-center text-muted">No tienes reservas todavía.</p>
      )}

      {reservas.map((r) => (
        <div key={r.id} className="card reserva-card mb-4">
          <div className="card-body">

            <h4 className="reserva-header mb-2">{r.pista_nombre}</h4>

            <p className="reserva-fecha mb-2">
              <strong>📅 Fecha:</strong> {r.fecha}
            </p>

            <p className="fw-semibold mt-3 mb-1">⏱ Horarios reservados:</p>

            {r.horarios.map((h) => (
              <div key={h.horario_id} className="reserva-horario">
                {h.franja} — {h.turno}
                <span className="float-end fw-semibold">{h.precio}€</span>
              </div>
            ))}

            <hr />

            <h4 className="reserva-total">Total: {r.precio_total}€</h4>

            <button
              className="btn btn-cancelar w-100 mt-3 fw-semibold"
              onClick={() => cancelarReserva(r.id)}
            >
              Cancelar reserva
            </button>

          </div>
        </div>
      ))}
    </div>
  );
}
