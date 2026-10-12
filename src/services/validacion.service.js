// SERVICIO: solo valida parámetros de entrada (Single Responsibility)
const FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;

function esFechaValida(texto) {
  if (!FECHA_ISO.test(texto)) return false;
  const d = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === texto;
}

const ValidacionService = {
  /**
   * @returns {{errores: string[], filtros: {desde: string, hasta: string, vendedorId: number|null}}}
   */
  validarFiltros({ desde, hasta, vendedorId } = {}) {
    const errores = [];

    if (!desde) errores.push('La fecha de inicio es obligatoria.');
    else if (!esFechaValida(desde)) errores.push('La fecha de inicio no es válida.');

    if (!hasta) errores.push('La fecha de fin es obligatoria.');
    else if (!esFechaValida(hasta)) errores.push('La fecha de fin no es válida.');

    if (errores.length === 0 && desde > hasta) {
      errores.push('La fecha de inicio no puede ser posterior a la fecha de fin.');
    }

    let id = null;
    if (vendedorId !== undefined && vendedorId !== null && vendedorId !== '') {
      id = Number(vendedorId);
      if (!Number.isInteger(id) || id <= 0) {
        errores.push('El vendedor seleccionado no es válido.');
        id = null;
      }
    }

    return { errores, filtros: { desde, hasta, vendedorId: id } };
  },
};

module.exports = ValidacionService;
