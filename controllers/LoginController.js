const Usuario = require("../models/Usuarios");
const users = require("../database/Users.json");
const fs = require("fs");
const bcrypt = require("bcrypt");

module.exports = {
    show: (req, res) => {
        res.render('login');
	},
	principal: (req, res) => {
        res.render('principal');
    },
    async login (req, res) {
		let { email, password } = req.body;
		
        //Procura usuário por e-mail
		const usuario = await Usuario.findOne({ where: { email } });

		//Criptografa senha digitada
		let senha = bcrypt.hashSync(password, 10);

		//E-mail e Senha válidos, redireciona
		if (usuario && bcrypt.compare(usuario.senha, senha)){
			//Sesssion do usuário logado
			req.session.usuario=JSON.stringify(usuario);
			
			return res.redirect("/principal");
		}

		//E-mail ou Senha inválidos
		//TODO: Exibir mensagem para usuário saber o que houve
		//TODO: Criar botão de esqueci minha senha
		return res.redirect("/login");
    }
}