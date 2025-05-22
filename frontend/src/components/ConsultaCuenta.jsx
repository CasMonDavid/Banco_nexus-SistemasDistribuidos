import React, { useState } from 'react';

const ConsultaCuenta = () => {
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  const consultarCuenta = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/cuenta/${numeroCuenta}`);
      if (!res.ok) throw new Error('Cuenta no encontrada');
      const data = await res.json();
      setResultado(data);
      setError(null);
    } catch (err) {
      setResultado(null);
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Consulta de Cuenta</h2>
      <input
        type="text"
        placeholder="Número de cuenta"
        value={numeroCuenta}
        onChange={(e) => setNumeroCuenta(e.target.value)}
      />
      <button onClick={consultarCuenta}>Consultar</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {resultado && (
        <div>
          <h3>Cliente: {resultado.cliente}</h3>
          <p>Saldo: ${resultado.saldo}</p>
          <h4>Movimientos:</h4>
          <ul>
            {resultado.transacciones.map((mov, i) => (
              <li key={i}>
                {mov.fecha} - {mov.tipo} - ${mov.monto}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ConsultaCuenta;
