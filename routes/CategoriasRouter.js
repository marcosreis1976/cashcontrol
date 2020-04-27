var express = require('express');
var router = express.Router();
const VerificaSeEstaLogado = require('../middlewares/VerificaSeEstaLogado');
const CategoriaController = require('../controllers/CategoriaController');
const { check, validationResult, body } = require('express-validator');

router.get('/categorias', VerificaSeEstaLogado, CategoriaController.list);
router.get('/categorias/create', VerificaSeEstaLogado, CategoriaController.create);
router.post('/categorias/store', VerificaSeEstaLogado, [
    check("nome").not().isEmpty().withMessage("Informe o nome da Categoria!"),
    check("tipo").not().isEmpty().withMessage("Selecione o tipo de Categoria!")
], CategoriaController.store);
router.get('/categorias/:id/edit', VerificaSeEstaLogado, CategoriaController.edit);
router.put('/categorias/:id/update', VerificaSeEstaLogado, [
    check("nome").not().isEmpty().withMessage("Informe o nome da Categoria!"),
    check("tipo").not().isEmpty().withMessage("Selecione o tipo de Categoria!")
], CategoriaController.update);
router.delete('/categorias/:id/delete', VerificaSeEstaLogado, CategoriaController.delete);

module.exports = router;