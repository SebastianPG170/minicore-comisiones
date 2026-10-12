const { Router } = require('express');
const ComisionController = require('../controllers/comision.controller');

const router = Router();

router.get('/', ComisionController.inicio);
router.get('/comisiones', ComisionController.calcular);
router.get('/api/comisiones', ComisionController.calcularApi);
router.get('/health', ComisionController.salud);

module.exports = router;
