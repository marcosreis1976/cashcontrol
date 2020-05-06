var express = require('express');
var router = express.Router();
const VerificaSeEstaLogado = require('../middlewares/VerificaSeEstaLogado');
const MetaController = require('../controllers/MetaController');
const { check, validationResult, body } = require('express-validator');

router.get('/metas', VerificaSeEstaLogado, MetaController.list);
router.post('/metas/seek', VerificaSeEstaLogado, [
    body("mes").custom((mes) =>{
        if (mes<1 || mes>12){
            return false;
        }
        else {
            return true;
        }
    }).withMessage("Mês deve ser entre 01 e 12!")
], MetaController.seek);
router.get('/metas/:id/create', VerificaSeEstaLogado, MetaController.create);
router.post('/metas/store', VerificaSeEstaLogado, [
    check("ano").isLength({ min: 4 }, { max: 4}).withMessage("Informe Ano com 4 digitos"),
    check("mes").isLength({ min: 1 }, { max: 2}).withMessage("Informe Mês com 2 digitos"),
    check("categoria").not().isEmpty().withMessage("Selecione a Categoria!"),
    //check("valorprevisto").not().isEmpty().withMessage("Informe o Valor Previsto!"),
    body("mes").custom((mes) =>{
        if (mes<1 || mes>12){
            return false;
        }
        else {
            return true;
        }
    }).withMessage("Mês deve ser entre 01 e 12!"),
    body("valorprevisto").custom((valorprevisto) =>{
        return Number(valorprevisto)>0
    }).withMessage("Valor da Meta deve ser maior que zero!")
], MetaController.store);
router.get('/metas/:id/edit', VerificaSeEstaLogado, MetaController.edit);
router.put('/metas/:id/update', VerificaSeEstaLogado, [
    check("ano").isLength({ min: 4 }, { max: 4}).withMessage("Informe Ano com 4 digitos"),
    check("mes").isLength({ min: 1 }, { max: 2}).withMessage("Informe Mês com 2 digitos"),
    check("categoria").not().isEmpty().withMessage("Selecione a Categoria!"),
    //check("valorprevisto").not().isEmpty().withMessage("Informe o Valor Previsto!"),
    body("mes").custom((mes) =>{
        if (mes<1 || mes>12){
            return false;
        }
        else {
            return true;
        }
    }).withMessage("Mês deve ser entre 01 e 12!"),
    body("valorprevisto").custom((valorprevisto) =>{
        return Number(valorprevisto)>0
    }).withMessage("Valor da Meta deve ser maior que zero!")
], MetaController.update);
router.delete('/metas/:id/delete', VerificaSeEstaLogado, MetaController.delete);

module.exports = router;