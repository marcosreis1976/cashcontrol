'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('despesas', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'usuarios', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      carteira_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'carteiras', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      categoria_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'categorias', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      data_despesa: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      valor: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
      },
      obs: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    
    });
    
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('despesas');
  }
  
};

