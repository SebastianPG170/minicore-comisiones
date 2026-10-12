// MODELO: Vendedor
// Datos de ejemplo en memoria. Para producción se reemplazaría por una BD
// (el resto de capas no cambia, solo este archivo).
const vendedores = [
  { id: 1, nombre: 'Ana Pérez' },
  { id: 2, nombre: 'Luis Torres' },
  { id: 3, nombre: 'María Gómez' },
  { id: 4, nombre: 'Carlos Ruiz' },
  { id: 5, nombre: 'Sofía Andrade' },
];

const VendedorModel = {
  listar() {
    return vendedores.map((v) => ({ ...v }));
  },
  buscarPorId(id) {
    const v = vendedores.find((x) => x.id === Number(id));
    return v ? { ...v } : null;
  },
};

module.exports = VendedorModel;
