const Meta = require("../models/Metas");
const Carteira = require("../models/Carteiras");
const Categoria = require("../models/Categorias");
const { check, validationResult, body } = require('express-validator');
const Sequelize = require('sequelize');
const moment = require('moment');
const dbConfig = require('../config/database');

moment.locale('pt-BR');
const con = new Sequelize(dbConfig);

module.exports = {
    async list (req, res) {
        let { id } = JSON.parse(req.session.usuario);

        const Periodo = {
            Ano: moment().year(),
            Mes: moment().format('MM')
        }

        /*const categorias = await Categoria.findAll({
            attributes: ['id', 'nome'],
            where: { usuario_id : id },
            include: [
                {
                model: Meta,
                as: 'meta',
                attributes: ['valorprevisto', 'id'],
                where: {ano: Ano, mes: Number(Mes)},
                required: false
                }]
        });*/
        
        let anofiltro=Periodo.Ano;
        let mesfiltro=Number(Periodo.Mes);
        let usuariofiltro=Number(id);

        const categorias = await con.query(
            "Select c.id, c.nome, IFNULL(m.valorprevisto,0) valorprevisto, IFNULL(m.id,0) meta_id, " +
            "IFNULL((Select sum(d.valor) from despesas d where d.usuario_id=c.usuario_id and " +
            "d.categoria_id=c.id and year(d.data_despesa)=:anofiltro and month(d.data_despesa)=:mesfiltro),0) valorgasto, " +
            "CASE WHEN IFNULL(m.valorprevisto,0)>0 THEN ROUND(((IFNULL((Select sum(d.valor) from despesas " +
            "d where d.usuario_id=c.usuario_id and d.categoria_id=c.id and year(d.data_despesa)=:anofiltro and " +
            "month(d.data_despesa)=:mesfiltro),0)/IFNULL(m.valorprevisto,0))*100),2) ELSE 0 END percentualgasto " +
            "from categorias c left outer join metas m on c.usuario_id=m.usuario_id and " +
            "c.id=m.categoria_id and m.ano=:anofiltro and m.mes=:mesfiltro where " +
            "c.usuario_id=:usuariofiltro",
            {
              replacements: {
                anofiltro, mesfiltro, usuariofiltro,
              },
              type: Sequelize.QueryTypes.SELECT,
            }
          );
        
        res.render('crud-metas/metalist', {categorias, Periodo})
    },
    async seek (req, res) {

        let listaDeErros = validationResult(req);

        let { id } = JSON.parse(req.session.usuario);

        //let { ano, mes } = req.query;
        let { ano, mes } = req.body;

        const Periodo = {
            Ano: moment().year(),
            Mes: moment().format('MM')
        }

        if (listaDeErros.isEmpty()){
            Periodo.Ano=ano;
            Periodo.Mes=mes;
        }

        let anofiltro=Periodo.Ano;
        let mesfiltro=Periodo.Mes;
        let usuariofiltro=Number(id);

        const categorias = await con.query(
            "Select c.id, c.nome, IFNULL(m.valorprevisto,0) valorprevisto, IFNULL(m.id,0) meta_id, " +
            "IFNULL((Select sum(d.valor) from despesas d where d.usuario_id=c.usuario_id and " +
            "d.categoria_id=c.id and year(d.data_despesa)=:anofiltro and month(d.data_despesa)=:mesfiltro),0) valorgasto, " +
            "CASE WHEN IFNULL(m.valorprevisto,0)>0 THEN ROUND(((IFNULL((Select sum(d.valor) from despesas " +
            "d where d.usuario_id=c.usuario_id and d.categoria_id=c.id and year(d.data_despesa)=:anofiltro and " +
            "month(d.data_despesa)=:mesfiltro),0)/IFNULL(m.valorprevisto,0))*100),2) ELSE 0 END percentualgasto " +
            "from categorias c left outer join metas m on c.usuario_id=m.usuario_id and " +
            "c.id=m.categoria_id and m.ano=:anofiltro and m.mes=:mesfiltro where " +
            "c.usuario_id=:usuariofiltro",
            {
            replacements: {
                anofiltro, mesfiltro, usuariofiltro,
            },
            type: Sequelize.QueryTypes.SELECT,
            }
        );
        
        if (listaDeErros.isEmpty()){
            res.render('crud-metas/metalist', {categorias, Periodo});
        }
        else {
            res.render('crud-metas/metalist', {categorias, Periodo, erros: listaDeErros.errors});
        }

    },
    async create (req, res) {
        //Id da Categoria
        let id = req.params.id;

        const Periodo = {
            Ano: moment().year(),
            Mes: moment().format('MM'),
            CategoriaId: id
        }

        //Usuário Logado
        let { id: usuario_id } = JSON.parse(req.session.usuario);

        //Categorias do Usuário
        const categorias = await Categoria.findAll({
            where: { usuario_id , id }
        });
        
        res.render('crud-metas/meta',{categorias, Periodo});
    },
    async store (req, res) {

        let listaDeErros = validationResult(req);

        //Id do Usuário
        let { id } = JSON.parse(req.session.usuario);

        if (listaDeErros.isEmpty()){
          
            //Campos do Formulário
            let { ano, mes, categoria, valorprevisto} = req.body;

            //Verifica se meta já existe
            const metaexiste = await Meta.findOne({
                attributes: ['id'],
                where: { usuario_id : id,
                         categoria_id : categoria,
                         ano : ano,
                         mes : mes }
            });

            if (metaexiste) {
                //Id da Categoria
                const Periodo = {
                    Ano: ano,
                    Mes: mes,
                    CategoriaId: categoria
                }

                //Categorias do Usuário
                const categorias = await Categoria.findAll({
                    where: { usuario_id: id , id: categoria }
                });

                const ErroCustomizado = "Já existe meta cadastrada para este periodo e categoria!";
        
                return res.render('crud-metas/meta',{categorias, Periodo, ErroCustomizado});

            }

            //Cria nova meta
            const meta = await Meta.create(
                {
                    ano: Number(ano), 
                    mes: Number(mes), 
                    categoria_id: categoria, 
                    usuario_id: id,
                    valorprevisto: Number(valorprevisto)
                }
            )

            const Periodo = {
                Ano: ano,
                Mes: mes
            }
    
            let anofiltro=Periodo.Ano;
            let mesfiltro=Number(Periodo.Mes);
            let usuariofiltro=Number(id);

            const categorias = await con.query(
                "Select c.id, c.nome, IFNULL(m.valorprevisto,0) valorprevisto, IFNULL(m.id,0) meta_id, " +
                "IFNULL((Select sum(d.valor) from despesas d where d.usuario_id=c.usuario_id and " +
                "d.categoria_id=c.id and year(d.data_despesa)=:anofiltro and month(d.data_despesa)=:mesfiltro),0) valorgasto, " +
                "CASE WHEN IFNULL(m.valorprevisto,0)>0 THEN ROUND(((IFNULL((Select sum(d.valor) from despesas " +
                "d where d.usuario_id=c.usuario_id and d.categoria_id=c.id and year(d.data_despesa)=:anofiltro and " +
                "month(d.data_despesa)=:mesfiltro),0)/IFNULL(m.valorprevisto,0))*100),2) ELSE 0 END percentualgasto " +
                "from categorias c left outer join metas m on c.usuario_id=m.usuario_id and " +
                "c.id=m.categoria_id and m.ano=:anofiltro and m.mes=:mesfiltro where " +
                "c.usuario_id=:usuariofiltro",
                {
                replacements: {
                    anofiltro, mesfiltro, usuariofiltro,
                },
                type: Sequelize.QueryTypes.SELECT,
                }
            );
            
            res.render('crud-metas/metalist', {categorias, Periodo})
        }
        else {

            //Id da Categoria
            let { categoria } = req.body;

            const Periodo = {
                Ano: moment().year(),
                Mes: moment().format('MM'),
                CategoriaId: categoria
            }

            //Usuário Logado
            let { id: usuario_id } = JSON.parse(req.session.usuario);
            
            //Categorias do Usuário
            const categorias = await Categoria.findAll({
                where: { usuario_id , id: categoria }
            });
    
            res.render('crud-metas/meta',{categorias, Periodo, erros: listaDeErros.errors});
        }
        
    },
    async edit (req, res) {
        //Id da Meta
        const id = req.params.id;

        //Busca a Meta pelo ID
        const meta = await Meta.findOne({
            where: { id }
        });

        //Categorias do Usuário
        const categorias = await Categoria.findAll({
            where: { usuario_id: meta.usuario_id , id: meta.categoria_id }
        });

        res.render('crud-metas/metaedit', {meta, categorias});
    },
    async update (req, res) {
        let listaDeErros = validationResult(req);

        //return res.send('chegou aqui');

        //Id do Usuário
        let { id: usuario_id } = JSON.parse(req.session.usuario);

        //Id da Meta
        let { id } = req.params;

        //return res.send('meta= ' + id);

        if (listaDeErros.isEmpty()){
            //return res.send('sem erros');

            //Campos do Formulário
            let { ano, mes, valorprevisto } = req.body;

            //Atualiza meta
            const meta = await Meta.update(
                {valorprevisto: Number(valorprevisto)},
                {where: {id}}
            )

            const Periodo = {
                Ano: ano,
                Mes: mes
            }
    
            let anofiltro=Periodo.Ano;
            let mesfiltro=Number(Periodo.Mes);
            let usuariofiltro=Number(usuario_id);

            const categorias = await con.query(
                "Select c.id, c.nome, IFNULL(m.valorprevisto,0) valorprevisto, IFNULL(m.id,0) meta_id, " +
                "IFNULL((Select sum(d.valor) from despesas d where d.usuario_id=c.usuario_id and " +
                "d.categoria_id=c.id and year(d.data_despesa)=:anofiltro and month(d.data_despesa)=:mesfiltro),0) valorgasto, " +
                "CASE WHEN IFNULL(m.valorprevisto,0)>0 THEN ROUND(((IFNULL((Select sum(d.valor) from despesas " +
                "d where d.usuario_id=c.usuario_id and d.categoria_id=c.id and year(d.data_despesa)=:anofiltro and " +
                "month(d.data_despesa)=:mesfiltro),0)/IFNULL(m.valorprevisto,0))*100),2) ELSE 0 END percentualgasto " +
                "from categorias c left outer join metas m on c.usuario_id=m.usuario_id and " +
                "c.id=m.categoria_id and m.ano=:anofiltro and m.mes=:mesfiltro where " +
                "c.usuario_id=:usuariofiltro",
                {
                replacements: {
                    anofiltro, mesfiltro, usuariofiltro,
                },
                type: Sequelize.QueryTypes.SELECT,
                }
            );
            
            res.render('crud-metas/metalist', {categorias, Periodo})
        }
        else {
            //return res.send('com erros');

            //Busca a Meta pelo ID
            const metaExiste = await Meta.findOne({
                where: { id }
            });

            const Periodo = {
                Ano: metaExiste.ano,
                Mes: metaExiste.mes,
                CategoriaId: metaExiste.categoria_id
            }

            //Categorias do Usuário
            const categorias = await Categoria.findAll({
                where: { usuario_id , id: metaExiste.categoria_id }
            });
    
            res.render('crud-metas/metaedit',{categorias, meta: metaExiste, erros: listaDeErros.errors});
        }
    },
    async delete (req, res) {
		//Id do Usuário
        let { id: usuario_id } = JSON.parse(req.session.usuario);

		// Capturar ID da meta a ser removida
        let id = req.params.id;
        
        id = Number(id);

		await Meta.destroy(
            {where: {id}}
        )

        const Periodo = {
            Ano: moment().year(),
            Mes: moment().format('MM')
        }

        let anofiltro=Periodo.Ano;
        let mesfiltro=Number(Periodo.Mes);
        let usuariofiltro=Number(usuario_id);

        const categorias = await con.query(
            "Select c.id, c.nome, IFNULL(m.valorprevisto,0) valorprevisto, IFNULL(m.id,0) meta_id, " +
            "IFNULL((Select sum(d.valor) from despesas d where d.usuario_id=c.usuario_id and " +
            "d.categoria_id=c.id and year(d.data_despesa)=:anofiltro and month(d.data_despesa)=:mesfiltro),0) valorgasto, " +
            "CASE WHEN IFNULL(m.valorprevisto,0)>0 THEN ROUND(((IFNULL((Select sum(d.valor) from despesas " +
            "d where d.usuario_id=c.usuario_id and d.categoria_id=c.id and year(d.data_despesa)=:anofiltro and " +
            "month(d.data_despesa)=:mesfiltro),0)/IFNULL(m.valorprevisto,0))*100),2) ELSE 0 END percentualgasto " +
            "from categorias c left outer join metas m on c.usuario_id=m.usuario_id and " +
            "c.id=m.categoria_id and m.ano=:anofiltro and m.mes=:mesfiltro where " +
            "c.usuario_id=:usuariofiltro",
            {
              replacements: {
                anofiltro, mesfiltro, usuariofiltro,
              },
              type: Sequelize.QueryTypes.SELECT,
            }
          );
        
        res.render('crud-metas/metalist', {categorias, Periodo})
    }
}