const connection = require("../config/db");
const express = require("express");
const router = express.Router();

// CRUD DE CLIENTES
router.get('/api/clientes', async (req, res, next) => {
    try {
        const [result] = await connection.query('SELECT * FROM clientes');
        res.json(result);
    } catch (err){
        console.log(err);
        res.status(500).send("Error al obtener la lista de clientes");
    }
});
router.get('/api/cliente/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const [result] = await connection.execute('SELECT * FROM clientes WHERE id = ?',[id]);
        if (result.length==0){
            return res.status(404).send("Cliente no encontrado");
        }else{
            res.json(result);
        }
    } catch (err){
        console.log(err);
        res.status(500).send("Error al obtener el cliente");
    }
});

//CRUD DE CUENTAS
router.get('/api/cuentas', async (req, res, next) => {
    try {
        const [result] = await connection.query('SELECT * FROM cuentas');
        res.json(result);
    } catch (err){
        console.log(err);
        res.status(500).send("Error al obtener la lista de cuentas");
    }
});
router.get('/api/cuenta/:id', async (req, res, next) => {
    try {
        const id = req.params.id;
        const [result] = await connection.execute('SELECT c.id AS cuenta_id, c.numero_cuenta, c.saldo, c.tipo AS tipo_cuenta, t.id AS transaccion_id, t.tipo AS tipo_transaccion, t.monto, t.fecha FROM cuentas c LEFT JOIN transacciones t ON c.id = t.cuenta_id WHERE c.cliente_id = ? ORDER BY c.id, t.fecha DESC',[id]);
        if (result.length==0){
            return res.status(404).send("Cuenta no encontrado");
        }else{
            res.json(result);
        }
    } catch (err){
        console.log(err);
        res.status(500).send("Error al obtener la cuenta");
    }
});

//CRUD DE TRANSACCIONES
router.post('/api/deposito', async (req, res) => {
    const { cuenta_id, monto, sucursal } = req.body;
    const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const conn = await connection.getConnection();

    try {
        await conn.beginTransaction();

        const [result] = await conn.query('SELECT saldo FROM cuentas WHERE id = ?',[cuenta_id]);
        if (result.length===0) {
            return res.status(500).json({
                status: false,
                message: 'No existe la cuenta especificada'
            })
        }

        await conn.execute('UPDATE cuentas SET saldo = saldo + ? WHERE id = ?',[monto, cuenta_id])

        await conn.execute('INSERT INTO transacciones (cuenta_id, tipo, monto, fecha, sucursal) VALUES (?,?,?,?,?)',
            [cuenta_id,'Deposito',monto, fecha, sucursal]);

        await conn.commit();
        
        res.json({
            status: true,
            message: 'Deposito exitoso'
        })
        
    } catch (error) {
        await conn.rollback();
        console.log(error);
        return res.status(500).json({
            status: false,
            message: 'Ocurrio un error en el servidor al intentar hacer el deposito'
        })
    }
})

module.exports = router;