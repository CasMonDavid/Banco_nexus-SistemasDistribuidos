import React, { useState } from "react";

export default function ConsultaTransacciones() {
  const [clienteId, setClienteId] = useState("");
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);

  async function consultarTransacciones() {
    setError(null);
    setDatos(null);

    if (!clienteId.trim()) {
      setError("Por favor ingresa el ID del cliente");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/cuenta/${clienteId.trim()}`);

      if (!res.ok) throw new Error("Cliente no encontrado o error en el servidor");
      const data = await res.json();

      // Agrupar datos por cuenta
      const cuentasMap = new Map();

      data.forEach((row) => {
        if (!cuentasMap.has(row.cuenta_id)) {
          cuentasMap.set(row.cuenta_id, {
            cuenta_id: row.cuenta_id,
            numero_cuenta: row.numero_cuenta,
            saldo: row.saldo,
            tipo_cuenta: row.tipo_cuenta,
            transacciones: [],
          });
        }

        if (row.transaccion_id) {
          cuentasMap.get(row.cuenta_id).transacciones.push({
            transaccion_id: row.transaccion_id,
            tipo_transaccion: row.tipo_transaccion,
            monto: row.monto,
            fecha: row.fecha,
          });
        }
      });

      const cuentasAgrupadas = Array.from(cuentasMap.values());
      setDatos(cuentasAgrupadas);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "1rem" }}>
      <h2>Consulta de Transacciones por Cliente</h2>

      <label>
        ID del Cliente:
        <input
          type="text"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          style={{ marginLeft: "0.5rem" }}
        />
      </label>

      <button onClick={consultarTransacciones} style={{ marginLeft: "1rem" }}>
        Consultar
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {datos && datos.length > 0 && (
        <>
          {datos.map((registro) => (
            <div key={registro.cuenta_id} style={{ marginTop: "2rem" }}>
              <h3>
                Cuenta #{registro.numero_cuenta} ({registro.tipo_cuenta}) - Saldo:{" "}
                {typeof registro.saldo === "number"
                  ? `$${registro.saldo.toFixed(2)}`
                  : registro.saldo && !isNaN(Number(registro.saldo))
                  ? `$${Number(registro.saldo).toFixed(2)}`
                  : "N/A"}
              </h3>

              {registro.transacciones.length > 0 ? (
                <table border="1" cellPadding="5" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Monto</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registro.transacciones.map((t) => (
                      <tr key={t.transaccion_id}>
                        <td>{t.tipo_transaccion}</td>
                        <td>
                          {t.monto && !isNaN(t.monto)
                            ? `$${parseFloat(t.monto).toFixed(2)}`
                            : "Sin monto"}
                        </td>
                        <td>{new Date(t.fecha).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No hay transacciones para esta cuenta.</p>
              )}
            </div>
          ))}
        </>
      )}

      {datos && datos.length === 0 && (
        <p>No se encontraron cuentas o transacciones para este cliente.</p>
      )}
    </div>
  );
}
