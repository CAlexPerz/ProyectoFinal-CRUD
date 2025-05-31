const express = require('express')
const bodyParser = require('body-parser')
const clientes = require('./Modelos/clientes.js') // Importar el modelo de la bd
const cors = require('cors'); //para permitir conexiones desde el front
const app = express()
const puerto = 3000

app.use(cors())
app.use(bodyParser.json())

app.listen(puerto, () => {
    console.log('servicio iniciado')
})

app.post('/clientes/agregar', async (req,res) => {
    const { nombre, correo, telefono } = req.body;
    const data = await clientes.create({
        nombre, correo, telefono
    })
    if (data == 0){
        res.sendStatus(404).send('Error al ingresar.')
    } else {
        res.send('Registro ingresado con exito');
    }
})

app.delete('/clientes/borrar/:id', async (req,res) => {
    const { id } = req.params;
    const data = await clientes.destroy({
        where: {
            id
        }
    })
    if (data == 0){
        res.sendStatus(404).send('Registro no existente.')
    } else {
        res.send('Registro eliminado con exito');
    }
})

app.put('/clientes/editar/:id', async (req,res) => {
    const { nombre, correo, telefono } = req.body;
    const { id } = req.params;
    const data = await clientes.update({
        nombre, correo, telefono
    }, {
        where: {
            id
        }
    })
    if (data == 0){
        res.sendStatus(404).send('Registro no existente.')
    } else {
        res.send('Registro actualizado con exito');
    }
})

app.get('/clientes', async (req, res) => {
    const data = await clientes.findAll();
    res.send(data);
})