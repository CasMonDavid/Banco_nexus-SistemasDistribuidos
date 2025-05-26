const axios = require('axios');

async function operarCDMX() {
  try {
    const res = await axios.post('http://localhost:4000/api/retirar', {
      cuenta_id: 1,
      monto: 175,
      sucursal: 'CDMX'
    },{
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('CDMX:', res.data);
  } catch (error) {
    console.error('CDMX error:', error?.response?.data || error.message || error);

  }
}

module.exports = operarCDMX;
