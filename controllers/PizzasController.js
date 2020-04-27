const pizzas = require('../database/Pizzas.json');
const fs = require('fs');

module.exports = {
	index: (req, res)=>{
		res.render("index",{pizzas});
	},
	show: (req, res) => {

		// Capturando a pizza com o id passado na rota
		let pizza = pizzas.find(
			pizza => pizza.id == req.params.id
		);

		// Capturando a posição da pizza no array
		let pos = pizzas.indexOf(pizza);

		// determinando o id da próxima pizza e da anterior
		let idPrev = null;
		let idNext = null;

		if(pos > 0){
			idPrev = pizzas[pos -1].id;
		}

		if(pos < pizzas.length - 1){
			idNext = pizzas[pos + 1].id;
		}

		// Retornando a pizza para o usuário
		if(pizza){
			res.render("pizza",{pizza, idNext, idPrev});
		} else {
			res.render("erros/pizzaNaoEncontrada",{id:req.params.id});
		}
	},
	
	search: (req, res) => {
		let { busca } = req.query;

		const pizzaBusca = pizzas.filter((pizza) => {
			if(pizza.nome.toLowerCase().search(busca) != -1){
				return true;
			}
		});
		console.log(pizzaBusca)
		return res.render("index", {pizzas:pizzaBusca});
		
	},
	create: (req, res) => {
		res.render('crud-pizzas/create');
	},

	store: (req, res) => {

		let {nome, ingredientes, preco } = req.body;
		//let img = "/img/no-image.png";
		let img = `/img/${req.file.filename}`;
		let id = pizzas[pizzas.length - 1].id + 1

		ingredientes = ingredientes.split(',');
		ingredientes.map(ing => ing.trim());
		
		preco = Number(preco);

		const pizza = {id,nome,ingredientes,preco,img, destaque:false};
		pizzas.push(pizza);
		
		fs.writeFileSync('database/Pizzas.json', JSON.stringify(pizzas));
		res.redirect('/');
	},
	list: (req, res) => {
		return res.render("crud-pizzas/list", {pizzas});
	},
	delete: (req, res) => {
		
		// Capturar ID da pizza a ser removida
		let id = req.params.id;

		//Encontrar posição no array
		let pos = pizzas.findIndex(
			pizza => pizza.id==id
		)
		
		//Remover pizza
		pizzas.splice(pos, 1);

		//Salvar array de pizza no arquivo
		fs.writeFileSync('database/Pizzas.json', JSON.stringify(pizzas));

		//Redirecionar usuário 
		res.redirect('/pizzas');
	},
	edit: (req, res) =>{
		const id = req.params.id;

		const index = pizzas.findIndex(
			pizza => pizza.id==id
		);

		res.render('crud-pizzas/edit', {pizza: pizzas[index]});
	},
	update: (req, res) => {
		let {id} = req.params;

		let {nome, ingredientes, preco } = req.body;

		//return res.send('Nome: ' + nome + ' - Ingredientes: ' + ingredientes + ' Preço: ' + preco);

		const pizzaIndex = pizzas.findIndex(
			pizza => pizza.id==id
		);

		ingredientes = ingredientes.split(',');
		ingredientes.map(ing => ing.trim());

		//let img = "/img/no-image.png";
		let img = `/img/${req.file.filename}`;
		//let img = `/img/${req.file.filename}`;
		
		preco = Number(preco);

		pizzas[pizzaIndex].nome = nome;
		pizzas[pizzaIndex].ingredientes = ingredientes;
		pizzas[pizzaIndex].preco = preco;
		pizzas[pizzaIndex].img = img;
		
		//return res.send(pizzas[pizzaIndex]);
		
		fs.writeFileSync('database/Pizzas.json', JSON.stringify(pizzas));
		res.redirect('/');
	}
}	