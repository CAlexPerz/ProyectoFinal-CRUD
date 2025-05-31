const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './BD/clientes.sqlite'
});

module.exports = sequelize;