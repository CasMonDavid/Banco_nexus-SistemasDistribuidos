import React, { useState } from "react";

export default function ConsultaTransacciones() {
  const [clienteId, setClienteId] = useState("");
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [montos, setMontos] = useState({});
  const [sucursales, setSucursales] = useState({});

  async function consultarTransacciones() {
  setError(null);
  setDatos(null);
  setMensaje(null);

  if (!clienteId.trim()) {
    setError("Por favor ingresa el ID del cliente");
    return;
  }

  try {
    const res = await fetch(`http://localhost:4000/api/cuenta/${clienteId.trim()}`);

    const contentType = res.headers.get("content-type");
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error("Error: " + errorText);
    }

    if (!contentType || !contentType.includes("application/json")) {
      const html = await res.text();
      throw new Error("Respuesta inesperada del servidor: " + html.slice(0, 100));
    }

    const data = await res.json();

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
          sucursal: row.sucursal || "No especificada",
        });
      }
    });

    const cuentasAgrupadas = Array.from(cuentasMap.values());
    setDatos(cuentasAgrupadas);
  } catch (err) {
    console.error("Error al consultar transacciones:", err.message);
    setError("❌ No se pudieron obtener las transacciones. " + err.message);
  }
}


  function handleMontoChange(cuentaId, valor) {
    setMontos((prev) => ({ ...prev, [cuentaId]: valor }));
  }

  function handleSucursalChange(cuentaId, valor) {
    setSucursales((prev) => ({ ...prev, [cuentaId]: valor }));
  }

  async function realizarOperacion(cuentaId, tipo) {
    const monto = montos[cuentaId];
    const sucursal = sucursales[cuentaId] || "Sucursal Central";

    if (!monto || isNaN(monto) || parseFloat(monto) <= 0) {
      setMensaje(`Ingresa un monto válido para ${tipo}`);
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/${tipo}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cuenta_id: cuentaId,
          monto: parseFloat(monto),
          sucursal: sucursal,
        }),
      });

      const resultado = await res.json();

      if (!res.ok) throw new Error(resultado.error || "Error en la operación");

      setMensaje(`✅ ${tipo === "deposito" ? "Depósito" : "Retiro"} exitoso`);
      consultarTransacciones();
    } catch (err) {
      setMensaje(`❌ ${err.message}`);
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
      {mensaje && <p style={{ color: mensaje.startsWith("✅") ? "green" : "red" }}>{mensaje}</p>}

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

              <div style={{ marginBottom: "1rem" }}>
                <select
                  value={sucursales[registro.cuenta_id] || ""}
                  onChange={(e) => handleSucursalChange(registro.cuenta_id, e.target.value)}
                  style={{ marginRight: "0.5rem" }}
                >
                  <option value="">Selecciona sucursal</option>
                  <option value="Sucursal Central">Sucursal Central</option>
                  <option value="Sucursal Norte">Sucursal Norte</option>
                  <option value="Sucursal Sur">Sucursal Sur</option>
                  <option value="Sucursal Este">Sucursal Este</option>
                  <option value="Sucursal Oeste">Sucursal Oeste</option>
                </select>

                <input
                  type="number"
                  placeholder="Monto"
                  value={montos[registro.cuenta_id] || ""}
                  onChange={(e) => handleMontoChange(registro.cuenta_id, e.target.value)}
                  style={{ marginRight: "0.5rem" }}
                />

                <button
                  onClick={() => realizarOperacion(registro.cuenta_id, "deposito")}
                  style={{ marginRight: "0.5rem" }}
                >
                  Depositar
                </button>
                <button onClick={() => realizarOperacion(registro.cuenta_id, "retiro")}>
                  Retirar
                </button>
              </div>

              {registro.transacciones.length > 0 ? (
                <table border="1" cellPadding="5" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Tipo</th>
                      <th>Monto</th>
                      <th>Fecha</th>
                      <th>Sucursal</th>
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
                        <td>{t.sucursal}</td>
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
