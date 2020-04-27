const { Model, DataTypes } = require('sequelize');

class Carteira extends Model {
    static init(connection) {
        super.init({
            nome: DataTypes.STRING,
            tipo: DataTypes.SMALLINT,
        }, {
            sequelize: connection,
        })
    }

    static associate(models) {
        this.belongsTo(models.Usuario, { foreignKey: 'usuario_id', as: 'usuario'});
    }
}

module.exports = Carteira;