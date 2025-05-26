const mysql = require('mysql2/promise');
require('dotenv').config();

async function crearBaseDeDatos() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLDATABASE,
      multipleStatements: true
    });

    await connection.query(`
      CREATE DATABASE IF NOT EXISTS nexus_banca;
      USE nexus_banca;

      CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        curp CHAR(18) UNIQUE NOT NULL,
        correo VARCHAR(100) UNIQUE NOT NULL,
        fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS cuentas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id INT,
        numero_cuenta VARCHAR(20) UNIQUE NOT NULL,
        saldo DECIMAL(10,2) DEFAULT 0.00,
        tipo VARCHAR(20) NOT NULL,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id)
      );

      CREATE TABLE IF NOT EXISTS transacciones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cuenta_id INT,
        tipo VARCHAR(10),
        monto DECIMAL(10,2) NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cuenta_id) REFERENCES cuentas(id)
      );
    `);

    console.log('✅ Base de datos y tablas creadas correctamente');
    await connection.end();
  } catch (error) {
    console.error('❌ Error al crear la base de datos:', error);
  }
}

crearBaseDeDatos();