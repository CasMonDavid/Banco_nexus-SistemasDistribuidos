const axios = require('axios');

async function operarTJ() {
  try {
    const res = await axios.post('http://localhost:4000/api/retirar', {
      cuenta_id: 3,
      monto: 60,
      sucursal: 'TJ'
    });
    console.log('TJ:', res.data);
  } catch (error) {
    console.error('TJ error:', error?.response?.data || error.message || error);

  }
}

module.exports = operarTJ;
