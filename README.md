# ProyectoFinal-CRUD
Proyecto final- CRUD con React - Desarrollo web del lado del servidor

# API CRUD

Se creo una API con operaciones CRUD a una base de datos sobre clientes:

## Dependencias

Para la creacion de la API se utilizo `JavaScript`, ``NODE``, ``Express``, ``Cons`` y ``Sequelize`` con la base de datos SQL en formato sqlite de BD Browser.

## Conexion con BD

Para poder llevar a cabo las operaciones CRUD correctamente es necesario que la API este sincronizada con la base de datos.

```javascript
const Sequelize = require('sequelize'); // Invocamos la dependencia de Sequelize para conectar la API con la base de datos.

const sequelize = new Sequelize({
    // Funcion para conectar la BD con la API
    dialect: 'sqlite', // tipo de BD
    storage: './BD/clientes.sqlite' // ruta de BD
});

module.exports = sequelize; // Exportar la conexión junto con el modulo de Sequelize
```

## Modelo

Tras conectar la base de datos con la API, es necesario establecer el modelo de bd, modelo que contiene las tablas dentro de la base de datos.

Se establecen las columnas y sus propiedades.

**Es necesario que los nombres de las variables sean exactamente iguales a los nombres de las columnas de las base de datos para que no exista ningun problema.**

```javascript
const { DataTypes } = require('sequelize'); // A traves de desestructuración se invoca el metodo de DataTypes de sequelize que permitira establecer el tipo de dato que tendra cada variable.
const sequelize = require('../conexion') // Se invoca la conexión previamente creada.


// Constante contenedora que definira las propiedades de la tabla en la BD
const clientes = sequelize.define('clientes' /*nombre de la tabla*/, {
    id: { type: DataTypes.INTEGER, primaryKey: true }, //Columnas y tipo de dato de la columna.
    nombre: { type: DataTypes.STRING },
    correo: { type: DataTypes.STRING },
    telefono: { type: DataTypes.STRING }
    }, {
    timestamps: false // Elimina la columna generada automaticamente.
})

module.exports = clientes; // Exportar metodo.
```

## APP

Define las dependencias y metodos requeridos.

```javascript
const express = require('express')
const bodyParser = require('body-parser')
const clientes = require('./Modelos/clientes.js') // Importar el modelo de la bd
const cors = require('cors'); //Permite conexiones desde el front
const app = express()
const puerto = 3000
```

Uso de los metodos para las solicitudes del front.

```javascript
app.use(cors())
app.use(bodyParser.json())
```

Función Listen para iniciar la API junto con mensaje de confirmación de ejecución.

```javascript
app.listen(puerto, () => {
    console.log('servicio iniciado')
})
```

### Operaciones CRUD

A partir de aqui se establecen las operaciones CRUD:
* CREATE
* READ
* UPDATE
* DELETE

#### Create

Se inicia con una petición POST, es necesario que sea asincrona para que no se ejecute ninguna acción hasta que los datos hayan sido obtenidos correctamente.

Se desestructuran las variables obtenidas a traves de las peticiones recibidas por el front, para posteriormente ser agregadas a la base de datos.

```javascript
app.post('/clientes/agregar', async (req,res) => {
    const { nombre, correo, telefono } = req.body;
    const data = await clientes.create({
        nombre, correo, telefono
    })
    if (data == 0){ // En caso de que data no contenga ningun valor enviara un estado de error y un mensaje de error.
        res.sendStatus(404).send('Error al ingresar.')
    } else { // Si todos los datos son ingresados correctamente se enviara un mensaje que confirmara la insercion de los datos.
        res.send('Registro ingresado con exito');
    }
})
```

#### Read

Petición GET que tiene como función mostrar todos los datos dentro de la base de datos.

```javascript
app.get('/clientes', async (req, res) => {
    const data = await clientes.findAll();
    res.send(data);
})
```

#### UPDATE

Petición PUT que tiene como función actualizar los datos dentro de la base de datos a traves de la ID.

```javascript
app.put('/clientes/editar/:id', async (req,res) => {
    const { nombre, correo, telefono } = req.body; // Desestructura los campos de la BD
    const { id } = req.params; // Se obtiene la id ingresada a traves de la ruta
    const data = await clientes.update({
        nombre, correo, telefono
    }, { // Los datos ingresados a traves del front seran actualizados si existe un registro con la ID ingresada.
        where: {
            id
        }
    })
    if (data == 0){ //Validación de integridad del contenido
        res.sendStatus(404).send('Registro no existente.')
    } else {
        res.send('Registro actualizado con exito');
    }
})
```

### DELETE

Petición DELETE que elimina el registro indicado por la ID ingresada en la ruta como unico requisito.

```javascript
app.delete('/clientes/borrar/:id', async (req,res) => {
    const { id } = req.params; // ID ingresada en la ruta
    const data = await clientes.destroy({
        where: {
            id // Si el registro con la misma ID existe entonces es eliminado
        }
    })
    if (data == 0){ //Validación
        res.sendStatus(404).send('Registro no existente.')
    } else {
        res.send('Registro eliminado con exito');
    }
})
```

# FRONTEND

El Frontend sera la parte gráfica que el usuario podra visualizar y ejecutar todas las operaciones CRUD establecidas con anterioridad en el Backend.

Sera un formulario con 4 inputs de texto para ingresar:
* Nombre
* Correo
* Teléfono
* ID

3 Botones con función de:

* Guardar
* Actualizar
* Eliminar

Y una lista que muestre todos los registros y columnas de la base de datos.


Por defecto al crear un proyecto con Vite se crearan directorios con los recursos necesarios para iniciar un proyecto. Entre ellos el archivo ``App.jsx`` que es donde se codificara el frontend.

``App.jsx``
```javascript
import { useEffect, useState } from 'react'
import './App.css' // importar el estilo
```
React importara automaticamente los metodos de su libreria al ser utilizados dentro del código.

Dentro de la función ya existente, se declaran las constantes de la tabla y las columnas de la base de datos con un useState.

```javascript
function App() {
    const [clientes, setClientes] = useState([])
    const [nombre,setNombre] = useState("")
    const [correo,setCorreo] = useState("")
    const [telefono,setTelefono] = useState("")
    const [id, setId] = useState("")
    }
```

Se crea una tabla que emulara la vista de la tabla de la base de datos en forma de listas. 

```javascript
return (
    <>
        <div class="table">
            <table>
                <thead /*Se nombran las columnas*/>
                <tr>
                    <td>ID</td>
                    <td>Nombre</td>
                    <td>Correo</td>
                    <td>Telefono</td>
                </tr>
                </thead>
                <tbody>
                {
//Usando map para escanear constantemente el contenido del arreglo de creado para la tabla clientes.
                    clientes.map( (item, index) => {
                    return ( 
// A traves de una función flecha creada a traves del .map que mostrara en la lista los registros ingresados en la tabla.
                        <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.nombre}</td>
                        <td>{item.correo}</td>
                        <td>{item.telefono}<td>
                        </tr>
                    )
                    })
                }
                </tbody>
            </table>
        </div>
    </>
  )
```