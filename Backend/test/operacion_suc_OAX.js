const axios = require('axios');

async function operarOAX() {
  try {
    const res = await axios.post('http://localhost:4000/api/deposito', {
      cuenta_id: 4,
      monto: 225,
      sucursal: 'OAX'
    });
    console.log('OAX:', res.data);
  } catch (error) {
    console.error('OAX error:', error?.response?.data || error.message || error);
  }
}

module.exports = operarOAX;
