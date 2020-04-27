var express = require('express');
var router = express.Router();

const PizzasController = require('../controllers/PizzasController');
const upload = require("../lib/upload");
const VerificaSeEstaLogado = require('../middlewares/VerificaSeEstaLogado');

/* GET home page. */
router.get('/pizzas/index', PizzasController.index);
router.get('/pizzas/busca/', PizzasController.search);
router.get('/pizzas/create', VerificaSeEstaLogado, PizzasController.create);
router.get('/pizzas', VerificaSeEstaLogado, PizzasController.list);
router.post('/pizzas', VerificaSeEstaLogado, upload.single("img"), PizzasController.store);
router.get('/pizzas/:id', PizzasController.show);
router.delete('/pizzas/:id', VerificaSeEstaLogado, PizzasController.delete);
router.get('/pizzas/:id/edit', VerificaSeEstaLogado, PizzasController.edit);
router.put('/pizzas/:id/update', VerificaSeEstaLogado, upload.single("img"), PizzasController.update);
module.exports = router;
