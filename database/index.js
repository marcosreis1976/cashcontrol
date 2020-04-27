const Sequelize = require('sequelize');
const dbConfig = require('../config/database');

const Usuario = require('../models/Usuarios');
const Carteira = require('../models/Carteiras');
const Categoria = require('../models/Categorias');
const Despesa = require('../models/Despesas');

const connection = new Sequelize(dbConfig);

Usuario.init(connection);
Carteira.init(connection);
Categoria.init(connection);
Despesa.init(connection);

Carteira.associate(connection.models);
Categoria.associate(connection.models);
Despesa.associate(connection.models);

module.exports = connection;
    