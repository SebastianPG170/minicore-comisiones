// MODELO: Venta
// Fechas en formato ISO (YYYY-MM-DD) para poder compararlas como texto.
const ventas = [
  // Ana Pérez
  { id: 1, vendedorId: 1, fecha: '2026-06-02', monto: 250, cliente: 'Ferretería Central' },
  { id: 2, vendedorId: 1, fecha: '2026-06-10', monto: 180, cliente: 'Papelería Andina' },
  { id: 3, vendedorId: 1, fecha: '2026-06-18', monto: 120, cliente: 'Minimarket Sol' },
  { id: 4, vendedorId: 1, fecha: '2026-07-05', monto: 400, cliente: 'Ferretería Central' },
  // Luis Torres
  { id: 5, vendedorId: 2, fecha: '2026-06-03', monto: 300, cliente: 'Distribuidora Norte' },
  { id: 6, vendedorId: 2, fecha: '2026-06-12', monto: 280, cliente: 'Tienda La Esquina' },
  { id: 7, vendedorId: 2, fecha: '2026-06-25', monto: 170, cliente: 'Bazar Quito' },
  { id: 8, vendedorId: 2, fecha: '2026-07-08', monto: 500, cliente: 'Distribuidora Norte' },
  // María Gómez
  { id: 9, vendedorId: 3, fecha: '2026-06-05', monto: 450, cliente: 'Supermercado Valle' },
  { id: 10, vendedorId: 3, fecha: '2026-06-14', monto: 300, cliente: 'Casa del Hogar' },
  { id: 11, vendedorId: 3, fecha: '2026-06-22', monto: 200, cliente: 'Tienda La Esquina' },
  { id: 12, vendedorId: 3, fecha: '2026-07-10', monto: 700, cliente: 'Supermercado Valle' },
  // Carlos Ruiz
  { id: 13, vendedorId: 4, fecha: '2026-06-01', monto: 900, cliente: 'Mayorista Pichincha' },
  { id: 14, vendedorId: 4, fecha: '2026-06-15', monto: 600, cliente: 'Distribuidora Norte' },
  { id: 15, vendedorId: 4, fecha: '2026-06-28', monto: 700, cliente: 'Mayorista Pichincha' },
  { id: 16, vendedorId: 4, fecha: '2026-07-12', monto: 1200, cliente: 'Hipermarket Sur' },
  // Sofía Andrade
  { id: 17, vendedorId: 5, fecha: '2026-06-07', monto: 150, cliente: 'Bazar Quito' },
  { id: 18, vendedorId: 5, fecha: '2026-06-20', monto: 220, cliente: 'Minimarket Sol' },
  { id: 19, vendedorId: 5, fecha: '2026-07-15', monto: 90, cliente: 'Papelería Andina' },
];

const VentaModel = {
  /**
   * Filtra ventas por rango de fechas (inclusivo) y, opcionalmente, por vendedor.
   * @param {{desde: string, hasta: string, vendedorId?: number|null}} filtros
   */
  filtrar({ desde, hasta, vendedorId = null }) {
    return ventas
      .filter((v) => v.fecha >= desde && v.fecha <= hasta)
      .filter((v) => (vendedorId ? v.vendedorId === Number(vendedorId) : true))
      .map((v) => ({ ...v }));
  },
};

module.exports = VentaModel;
