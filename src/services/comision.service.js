// SERVICIO: lógica de negocio del cálculo de comisiones.
// Recibe sus dependencias por constructor (Inversión de Dependencias),
// así se puede probar con datos falsos sin tocar los modelos reales.
const ValidacionService = require('./validacion.service');

const redondear = (n) => Math.round(n * 100) / 100;

class ComisionService {
  constructor({ ventaModel, vendedorModel, comisionFactory }) {
    this.ventaModel = ventaModel;
    this.vendedorModel = vendedorModel;
    this.comisionFactory = comisionFactory;
  }

  /**
   * Calcula la comisión de cada vendedor en el rango de fechas.
   * La regla (porcentaje) se elige según el TOTAL vendido en el período.
   */
  calcular(entrada) {
    const { errores, filtros } = ValidacionService.validarFiltros(entrada);
    if (errores.length > 0) {
      return { errores, filtros, vendedores: [], resumen: null };
    }

    const ventas = this.ventaModel.filtrar(filtros);

    const vendedores = this.vendedorModel
      .listar()
      .filter((v) => (filtros.vendedorId ? v.id === filtros.vendedorId : true))
      .map((vendedor) => {
        const susVentas = ventas.filter((v) => v.vendedorId === vendedor.id);
        const totalVentas = redondear(susVentas.reduce((acc, v) => acc + v.monto, 0));
        const estrategia = this.comisionFactory.crearEstrategia(totalVentas);

        return {
          id: vendedor.id,
          nombre: vendedor.nombre,
          ventas: susVentas,
          cantidadVentas: susVentas.length,
          totalVentas,
          regla: estrategia.nombre,
          porcentaje: estrategia.porcentaje,
          comision: estrategia.calcular(totalVentas),
        };
      })
      .filter((v) => v.cantidadVentas > 0);

    const resumen = {
      totalVentas: redondear(vendedores.reduce((acc, v) => acc + v.totalVentas, 0)),
      totalComisiones: redondear(vendedores.reduce((acc, v) => acc + v.comision, 0)),
      cantidadVendedores: vendedores.length,
      cantidadVentas: vendedores.reduce((acc, v) => acc + v.cantidadVentas, 0),
    };

    return { errores: [], filtros, vendedores, resumen };
  }
}

module.exports = ComisionService;
