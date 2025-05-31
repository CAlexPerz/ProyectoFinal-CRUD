import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [clientes, setClientes] = useState([])
    const [nombre,setNombre] = useState("")
    const [correo,setCorreo] = useState("")
    const [telefono,setTelefono] = useState("")
    const [id, setId] = useState("")



  useEffect( () => {
    fetch ('http://localhost:3000/clientes') //Invoca la API a traves de la ruta local
    .then((res) => {
      return res.json();
    })
    . then((data) => {
      console.log('data desde API', data);
      setClientes(data)
    })
  }, [])

    // Agregar cliente
  const Agregar = () => {
    if (!nombre || !correo || !telefono) { // si algunos de los campos esta vacio mostrara un mensaje
        alert("Ingresa todos los datos.") // y no permitira llevar a cabo la inserción
        return;
    }
    fetch('http://localhost:3000/clientes/agregar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, telefono }) // Formatea la petición en JSON para que sea recibida por la API
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg)
        window.location.reload()
      })
  }

  // Actualizar cliente
  const Actualizar = () => {
    if (!id || !nombre || !correo || !telefono) {
        alert("Ingresa todos los datos.")
        return;
    }

    fetch(`http://localhost:3000/clientes/editar/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, correo, telefono })
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg)
        window.location.reload()
      })
  }

  // Eliminar cliente
  const Eliminar = () => {
    if (!id) {
        alert("La ID no ha sido ingresada.")
        return;
    }

    fetch(`http://localhost:3000/clientes/borrar/${id}`, {
      method: 'DELETE'
    })
      .then(res => res.text())
      .then(msg => {
        alert(msg)
        window.location.reload()
      })
  }

  return (
    <>
        <div class="card">
            <form>
                <div class="form__group field" /* Se crea un contenedor individual para cada Input para aplicar el estilo */> 
                    <input type="text" class="form__field" placeholder='Nombre' required="" // Aplicar estilo al input
                    value={nombre} onChange={(e) => setNombre(e.target.value) /*Enviar valor ingresado a la API*/} />
                        <label for="nombre" class="form__label">Nombre</label>
                </div>
                <div class="form__group field">
                    <input type="text" class="form__field" placeholder="Correo" required=""
                    value={correo} onChange={(e) => setCorreo(e.target.value)} />
                        <label for="correo" class="form__label">Correo</label>
                </div>
                <div class="form__group field">
                    <input type="text" class="form__field" placeholder="Teléfono" required="" 
                    value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                        <label for="telefono" class="form__label">Teléfono</label>
                </div>
                <div class="form__group field">
                <input type="text" class="form__field" placeholder="ID" required=""
                value={id} onChange={(e) => setId(e.target.value)} />
                <label for="id" class="form__label">ID</label>
                <p>El ID es solo requerido para Actualizar o Eliminar</p>
                </div>
                <br />
            </form>
                <div class="botones" /* Llamar funciones CRUD al pulsar cada botón */>
                    <button onClick={Agregar} className='button'>Guardar</button>
                    <button onClick={Actualizar} className='button'>Actualizar</button>
                    <button onClick={Eliminar} className='button'>Eliminar</button>
                </div>
        </div>
        <br />
        <div class="table">
            <table>
                <thead>
                <tr>
                    <td>ID</td>
                    <td>Nombre</td>
                    <td>Correo</td>
                    <td>Telefono</td>
                </tr>
                </thead>
                <tbody>
                {
                    clientes.map( (item, index) => {
                    return (
                        <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.nombre}</td>
                        <td>{item.correo}</td>
                        <td>{item.telefono}</td>
                        </tr>
                    )
                    })
                }
                </tbody>
            </table>
        </div>
    </>
  )
}

export default App;