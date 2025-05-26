const operarCDMX = require('./operacion_suc_CDMX');
const operarBCS = require('./operacion_suc_BCS');
const operarJAL = require('./operacion_suc_JAL');
const consultaOAX = require('./operacion_suc_OAX');
const consultaCD = require('./operacion_suc_CD');

async function ejecutarSimulacion() {
  console.log('Ejecutando operaciones concurrentes...\n');

  const resultados = await Promise.allSettled([
    operarCDMX(),
    operarBCS(),
    operarJAL(),
    consultaOAX(),
    consultaCD()
  ]);

  console.log('\nResultados de la simulación:');
  resultados.forEach((resultado, i) => {
    console.log(`Proceso ${i + 1}:`, resultado.status, resultado.value || resultado.reason);
  });
}

ejecutarSimulacion();
