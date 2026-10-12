// CONTROLADOR (C de MVC): recibe la petición, llama al servicio y elige la vista.
// No contiene lógica de negocio.
const ComisionService = require('../services/comision.service');
const VentaModel = require('../models/venta.model');
const VendedorModel = require('../models/vendedor.model');
const ComisionFactory = require('../factories/comision.factory');

const servicio = new ComisionService({
  ventaModel: VentaModel,
  vendedorModel: VendedorModel,
  comisionFactory: ComisionFactory,
});

const datosBase = () => ({
  vendedores: VendedorModel.listar(),
  reglas: ComisionFactory.listarReglas(),
});

const ComisionController = {
  // GET /
  inicio(req, res) {
    res.render('index', {
      ...datosBase(),
      filtros: { desde: '', hasta: '', vendedorId: null },
      errores: [],
      resultado: null,
    });
  },

  // GET /comisiones?desde=&hasta=&vendedorId=
  calcular(req, res) {
    const resultado = servicio.calcular(req.query);
    res.status(resultado.errores.length ? 400 : 200).render('index', {
      ...datosBase(),
      filtros: {
        desde: req.query.desde || '',
        hasta: req.query.hasta || '',
        vendedorId: resultado.filtros.vendedorId,
      },
      errores: resultado.errores,
      resultado: resultado.errores.length ? null : resultado,
    });
  },

  // GET /api/comisiones (misma lógica, respuesta JSON)
  calcularApi(req, res) {
    const resultado = servicio.calcular(req.query);
    if (resultado.errores.length) {
      return res.status(400).json({ errores: resultado.errores });
    }
    return res.json(resultado);
  },

  // GET /health (para Render)
  salud(req, res) {
    res.json({ estado: 'ok' });
  },
};

module.exports = ComisionController;
