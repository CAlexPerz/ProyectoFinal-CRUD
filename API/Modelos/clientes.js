const { DataTypes } = require('sequelize');
const sequelize = require('../conexion')

const clientes = sequelize.define('clientes', {
    id: { type: DataTypes.INTEGER, primaryKey: true },
    nombre: { type: DataTypes.STRING },
    correo: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING }
    }, {
    timestamps: false
})

module.exports = clientes;