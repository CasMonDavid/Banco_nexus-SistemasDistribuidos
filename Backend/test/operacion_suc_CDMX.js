const axios = require('axios');

async function operarCDMX() {
  try {
    const res = await axios.post('http://localhost:3000/api/deposito', {
      cuenta_id: 1,
      monto: 100,
      sucursal: 'CDMX'
    });
    console.log('CDMX:', res.data);
  } catch (error) {
    console.error('CDMX error:', error?.response?.data || error.message || error);

  }
}

module.exports = operarCDMX;