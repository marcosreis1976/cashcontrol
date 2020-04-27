var express = require('express');
var router = express.Router();
const VerificaSeEstaLogado = require('../middlewares/VerificaSeEstaLogado');
const CarteiraController = require('../controllers/CarteiraController');
const { check, validationResult, body } = require('express-validator');

router.get('/carteiras', VerificaSeEstaLogado, CarteiraController.list);
router.get('/carteiras/create', VerificaSeEstaLogado, CarteiraController.create);
router.post('/carteiras/store', VerificaSeEstaLogado, [
    check("nome").not().isEmpty().withMessage("Informe o nome da Carteira!"),
    check("tipo").not().isEmpty().withMessage("Selecione o tipo de Carteira!")
], CarteiraController.store);
router.get('/carteiras/:id/edit', VerificaSeEstaLogado, CarteiraController.edit);
router.put('/carteiras/:id/update', VerificaSeEstaLogado, [
    check("nome").not().isEmpty().withMessage("Informe o nome da Carteira!"),
    check("tipo").not().isEmpty().withMessage("Selecione o tipo de Carteira!")
], CarteiraController.update);
router.delete('/carteiras/:id/delete', VerificaSeEstaLogado, CarteiraController.delete);

module.exports = router;