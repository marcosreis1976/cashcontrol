var express = require('express');
var router = express.Router();
const VerificaSeEstaLogado = require('../middlewares/VerificaSeEstaLogado');
const DespesaController = require('../controllers/DespesaController');
const { check, validationResult, body } = require('express-validator');

router.get('/despesas', VerificaSeEstaLogado, DespesaController.list);
router.get('/despesas/create', VerificaSeEstaLogado, DespesaController.create);
router.post('/despesas/store', VerificaSeEstaLogado, [
    check("data").not().isEmpty().withMessage("Informe a Data"),
    check("valor").not().isEmpty().withMessage("Informe o Valor!"),
    check("categoria").not().isEmpty().withMessage("Selecione a Categoria!"),
    check("carteira").not().isEmpty().withMessage("Selecione a Categoria!")
], DespesaController.store);
router.get('/despesas/:id/edit', VerificaSeEstaLogado, DespesaController.edit);
router.put('/despesas/:id/update', VerificaSeEstaLogado, [
    check("data").not().isEmpty().withMessage("Informe a Data"),
    check("valor").not().isEmpty().withMessage("Informe o Valor!"),
    check("categoria").not().isEmpty().withMessage("Selecione a Categoria!"),
    check("carteira").not().isEmpty().withMessage("Selecione a Categoria!")
], DespesaController.update);
router.delete('/despesas/:id/delete', VerificaSeEstaLogado, DespesaController.delete);

module.exports = router;