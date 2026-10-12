// PATRÓN FACTORY
// Centraliza la decisión de qué estrategia usar según el monto vendido.
// Para agregar una regla nueva solo se toca este archivo y el de estrategias.
const {
  ComisionBasica,
  ComisionMedia,
  ComisionAlta,
  ComisionPremium,
} = require('../strategies/comision.strategies');

const ComisionFactory = {
  crearEstrategia(montoTotal) {
    if (montoTotal <= 600) return new ComisionBasica();
    if (montoTotal <= 800) return new ComisionMedia();
    if (montoTotal <= 1000) return new ComisionAlta();
    return new ComisionPremium();
  },

  // Lista de reglas para mostrarlas en la vista
  listarReglas() {
    return [
      new ComisionBasica(),
      new ComisionMedia(),
      new ComisionAlta(),
      new ComisionPremium(),
    ].map(({ nombre, porcentaje, rango }) => ({ nombre, porcentaje, rango }));
  },
};

module.exports = ComisionFactory;
