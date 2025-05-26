const axios = require('axios');

async function operarBCS() {
  try {
    const res = await axios.post('http://localhost:3000/api/deposito', {
      cuenta_id: 5,
      monto: 100,
      sucursal: 'BCS'
    },{
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('BCS:', res.data);
  } catch (error) {
    console.error('BCS error:', error?.response?.data || error.message || error);

  }
}

module.exports = operarBCS;
