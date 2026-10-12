// PATRÓN STRATEGY
// Cada estrategia encapsula una regla de comisión. Todas exponen la misma
// interfaz (nombre, porcentaje, calcular), por eso son intercambiables.

class ComisionStrategy {
  constructor(nombre, porcentaje, rango) {
    this.nombre = nombre;
    this.porcentaje = porcentaje; // 6 significa 6 %
    this.rango = rango; // texto descriptivo para la vista
  }

  calcular(monto) {
    return Math.round(monto * (this.porcentaje / 100) * 100) / 100;
  }
}

class ComisionBasica extends ComisionStrategy {
  constructor() {
    super('Comisión Básica', 6, '$0 – $600');
  }
}

class ComisionMedia extends ComisionStrategy {
  constructor() {
    super('Comisión Media', 8, '$600,01 – $800');
  }
}

class ComisionAlta extends ComisionStrategy {
  constructor() {
    super('Comisión Alta', 10, '$800,01 – $1.000');
  }
}

class ComisionPremium extends ComisionStrategy {
  constructor() {
    super('Comisión Premium', 15, 'Más de $1.000');
  }
}

module.exports = {
  ComisionStrategy,
  ComisionBasica,
  ComisionMedia,
  ComisionAlta,
  ComisionPremium,
};
