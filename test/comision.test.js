const test = require('node:test');
const assert = require('node:assert/strict');

const ComisionFactory = require('../src/factories/comision.factory');
const ComisionService = require('../src/services/comision.service');
const ValidacionService = require('../src/services/validacion.service');
const VentaModel = require('../src/models/venta.model');
const VendedorModel = require('../src/models/vendedor.model');
const app = require('../src/app');

const crearServicio = () =>
  new ComisionService({
    ventaModel: VentaModel,
    vendedorModel: VendedorModel,
    comisionFactory: ComisionFactory,
  });

test('Factory elige la estrategia correcta según el monto', () => {
  assert.equal(ComisionFactory.crearEstrategia(0).porcentaje, 6);
  assert.equal(ComisionFactory.crearEstrategia(600).porcentaje, 6);
  assert.equal(ComisionFactory.crearEstrategia(600.01).porcentaje, 8);
  assert.equal(ComisionFactory.crearEstrategia(800).porcentaje, 8);
  assert.equal(ComisionFactory.crearEstrategia(1000).porcentaje, 10);
  assert.equal(ComisionFactory.crearEstrategia(1000.01).porcentaje, 15);
});

test('Strategy calcula la comisión con 2 decimales', () => {
  assert.equal(ComisionFactory.crearEstrategia(550).calcular(550), 33);
  assert.equal(ComisionFactory.crearEstrategia(2200).calcular(2200), 330);
});

test('Validación rechaza fechas faltantes, inválidas o invertidas', () => {
  assert.ok(ValidacionService.validarFiltros({}).errores.length >= 2);
  assert.ok(ValidacionService.validarFiltros({ desde: '2026-02-30', hasta: '2026-03-01' }).errores.length > 0);
  assert.ok(
    ValidacionService.validarFiltros({ desde: '2026-07-01', hasta: '2026-06-01' }).errores[0].includes('posterior'),
  );
  assert.equal(
    ValidacionService.validarFiltros({ desde: '2026-06-01', hasta: '2026-06-30' }).errores.length,
    0,
  );
});

test('Servicio calcula junio 2026 para todos los vendedores', () => {
  const r = crearServicio().calcular({ desde: '2026-06-01', hasta: '2026-06-30' });
  assert.equal(r.errores.length, 0);
  assert.equal(r.vendedores.length, 5);

  const porNombre = Object.fromEntries(r.vendedores.map((v) => [v.nombre, v]));
  assert.equal(porNombre['Ana Pérez'].totalVentas, 550);
  assert.equal(porNombre['Ana Pérez'].comision, 33);
  assert.equal(porNombre['Luis Torres'].totalVentas, 750);
  assert.equal(porNombre['Luis Torres'].comision, 60);
  assert.equal(porNombre['María Gómez'].totalVentas, 950);
  assert.equal(porNombre['María Gómez'].comision, 95);
  assert.equal(porNombre['Carlos Ruiz'].totalVentas, 2200);
  assert.equal(porNombre['Carlos Ruiz'].comision, 330);
  assert.equal(porNombre['Sofía Andrade'].totalVentas, 370);
  assert.equal(porNombre['Sofía Andrade'].comision, 22.2);

  assert.equal(r.resumen.totalVentas, 4820);
  assert.equal(r.resumen.totalComisiones, 540.2);
});

test('Servicio filtra por vendedor y por rango (inclusivo)', () => {
  const r = crearServicio().calcular({ desde: '2026-06-01', hasta: '2026-06-02', vendedorId: '4' });
  assert.equal(r.vendedores.length, 1);
  assert.equal(r.vendedores[0].nombre, 'Carlos Ruiz');
  assert.equal(r.vendedores[0].totalVentas, 900);
  assert.equal(r.vendedores[0].regla, 'Comisión Alta');
});

test('Servicio devuelve lista vacía si no hay ventas en el rango', () => {
  const r = crearServicio().calcular({ desde: '2025-01-01', hasta: '2025-01-31' });
  assert.equal(r.vendedores.length, 0);
  assert.equal(r.resumen.totalComisiones, 0);
});

test('HTTP: /health, /api/comisiones y vista HTML', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const health = await fetch(`${base}/health`);
    assert.equal(health.status, 200);

    const api = await fetch(`${base}/api/comisiones?desde=2026-06-01&hasta=2026-06-30`);
    assert.equal(api.status, 200);
    const json = await api.json();
    assert.equal(json.resumen.totalComisiones, 540.2);

    const malo = await fetch(`${base}/api/comisiones?desde=2026-07-01&hasta=2026-06-01`);
    assert.equal(malo.status, 400);

    const html = await fetch(`${base}/comisiones?desde=2026-06-01&hasta=2026-06-30`);
    assert.equal(html.status, 200);
    assert.match(await html.text(), /Carlos Ruiz/);

    const inicio = await fetch(`${base}/`);
    assert.equal(inicio.status, 200);

    const noExiste = await fetch(`${base}/nada`);
    assert.equal(noExiste.status, 404);
  } finally {
    server.close();
  }
});
