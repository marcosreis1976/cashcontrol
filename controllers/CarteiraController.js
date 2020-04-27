//const Usuario = require("../models/Usuarios");
const Carteira = require("../models/Carteiras");
//const users = require("../database/Users.json");
//const fs = require("fs");
//const bcrypt = require("bcrypt");
const { check, validationResult, body } = require('express-validator');
const Sequelize = require('sequelize');

module.exports = {
    async store (req, res) {

        let listaDeErros = validationResult(req);

        if (listaDeErros.isEmpty()){
            //Id do Usuário
            let { id } = JSON.parse(req.session.usuario);

            //Campo do Formulário
            let { nome, tipo} = req.body;

            const carteira = await Carteira.create(
                {nome, tipo, usuario_id: id}
                )

            //const carteiras = await Carteira.findAll({ where: { usuario_id : id } });

            const carteiras = await Carteira.findAll({
                attributes: ['id', 'nome', [Sequelize.literal(`CASE tipo WHEN 1 THEN 'Conta Bancária' WHEN 2 THEN 'Carteira Pessoal' WHEN 3 THEN 'Cartão de Débito' ELSE 'Cartão de Crédito' END`), 'tipo']],
                where: { usuario_id : id }
            });

            res.render('crud-carteiras/carteiralist', {carteiras})
        }
        else {
            res.render('crud-carteiras/carteira', {erros:listaDeErros.errors})
        }
        
    },
    create: (req, res) => {
        //res.send("Chegou aqui!");
        res.render('crud-carteiras/carteira');
    },
    async list (req, res) {

        let { id } = JSON.parse(req.session.usuario);

        const carteiras = await Carteira.findAll({
            attributes: ['id', 'nome', [Sequelize.literal(`CASE tipo WHEN 1 THEN 'Conta Bancária' WHEN 2 THEN 'Carteira Pessoal' WHEN 3 THEN 'Cartão de Débito' ELSE 'Cartão de Crédito' END`), 'tipo']],
            where: { usuario_id : id }
        });
        //return res.send(carteiras);
        
        res.render('crud-carteiras/carteiralist', {carteiras})
    },
    async edit (req, res) {
		const id = req.params.id;
        
        const carteira = await Carteira.findByPk(id);

		res.render('crud-carteiras/carteiraedit', {carteira: carteira});
    },
    async update (req, res) {
        let listaDeErros = validationResult(req);

        //Id da Carteira
        let id = req.params.id;

        if (listaDeErros.isEmpty()){
            //Id do Usuário
            let { id: usuario_id } = JSON.parse(req.session.usuario);

            //Campo do Formulário
            let { nome, tipo} = req.body;

            const carteira = await Carteira.update(
                {nome, tipo},
                {where: {id}}
            )

            const carteiras = await Carteira.findAll({
                attributes: ['id', 'nome', [Sequelize.literal(`CASE tipo WHEN 1 THEN 'Conta Bancária' WHEN 2 THEN 'Carteira Pessoal' WHEN 3 THEN 'Cartão de Débito' ELSE 'Cartão de Crédito' END`), 'tipo']],
                where: { usuario_id }
            });

            res.render('crud-carteiras/carteiralist', {carteiras})
        }
        else {
            const carteira2 = await Carteira.findByPk(id);

            //return res.send(carteira2);

            res.render('crud-carteiras/carteiraedit', {erros:listaDeErros.errors, carteira: carteira2})
        }
    },
    async delete (req, res) {
		//Id do Usuário
        let { id: usuario_id } = JSON.parse(req.session.usuario);

		// Capturar ID da carteira a ser removida
        let id = req.params.id;
        
        id = Number(id);

		await Carteira.destroy(
            {where: {id}}
        )

        const carteiras = await Carteira.findAll({
            attributes: ['id', 'nome', [Sequelize.literal(`CASE tipo WHEN 1 THEN 'Conta Bancária' WHEN 2 THEN 'Carteira Pessoal' WHEN 3 THEN 'Cartão de Débito' ELSE 'Cartão de Crédito' END`), 'tipo']],
            where: { usuario_id }
        });

        res.render('crud-carteiras/carteiralist', {carteiras})
    }
}