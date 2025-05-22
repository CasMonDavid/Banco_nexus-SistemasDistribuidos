import React, { useState } from "react";

export default function ConsultaTransacciones() {
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [transacciones, setTransacciones] = useState(null);
  const [error, setError] = useState(null);

  async function consultarTransacciones() {
    setError(null);
    setTransacciones(null);
    if (!numeroCuenta.trim()) {
      setError("Por favor ingresa un número de cuenta");
      return;
    }

    try {
      const res = await fetch(`/api/cuentas/${numeroCuenta.trim()}/transacciones`);
      if (!res.ok) throw new Error("Cuenta no encontrada o error en el servidor");
      const data = await res.json();
      setTransacciones(data.transacciones);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "1rem" }}>
      <h2>Consulta de Transacciones</h2>

      <label>
        Número de cuenta:
        <input
          type="text"
          value={numeroCuenta}
          onChange={(e) => setNumeroCuenta(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
      </label>

      <button onClick={consultarTransacciones} style={{ marginLeft: "1rem" }}>
        Consultar
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {transacciones && transacciones.length > 0 && (
        <table border="1" cellPadding="5" style={{ marginTop: "1rem", width: "100%" }}>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((t) => (
              <tr key={t.id}>
                <td>{t.tipo}</td>
                <td>${t.monto.toFixed(2)}</td>
                <td>{new Date(t.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {transacciones && transacciones.length === 0 && (
        <p>No se encontraron transacciones para esta cuenta.</p>
      )}
    </div>
  );
}
