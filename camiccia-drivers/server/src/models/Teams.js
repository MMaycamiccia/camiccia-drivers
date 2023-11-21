const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    //defino Teams sin ID ya que lo genera solo y no necesito que no se pise, con el numero me alcanza
    sequelize.define('Team', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
    });
};