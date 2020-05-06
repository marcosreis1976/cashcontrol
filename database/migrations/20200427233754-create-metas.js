'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('metas', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        //primaryKey: true,
        allowNull: false,
        references: { model: 'usuarios', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      categoria_id: {
        type: Sequelize.INTEGER,
        //primaryKey: true,
        allowNull: false,
        references: { model: 'categorias', key: 'id'},
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ano: {
        type: Sequelize.SMALLINT,
        //primaryKey: true,
        allowNull: false,
      },
      mes: {
        type: Sequelize.SMALLINT,
        //primaryKey: true,
        allowNull: false,
      },
      valorprevisto: {
        type: Sequelize.DECIMAL(10,2),
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
    return queryInterface.dropTable('metas');
  }
  
};

