const { Model, DataTypes } = require('sequelize');

class Metas extends Model {
    static init(connection) {
        super.init({
            ano: DataTypes.SMALLINT,
            mes: DataTypes.SMALLINT,
            valorprevisto: DataTypes.DECIMAL(10,2)
        }, {
            sequelize: connection,
        })
    }

    static associate(models) {
        this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario'});
        this.belongsTo(models.Categorias, { foreignKey: 'categoria_id', as: 'categoria'});
    }
    
}

//Metas.removeAttribute('id');

module.exports = Metas;