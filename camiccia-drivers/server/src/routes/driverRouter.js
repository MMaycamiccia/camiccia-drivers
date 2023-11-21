const { Router } = require('express');
const { getAllDrivers, getDriverByName, getDriverByID } = require('../controllers/index');

const router = Router();

router.get('/', async (req, res) => { //maneja la solicitud y la respuesta .- 
    const name = req.query.name; //hace la consulta por nnombre (name)
    const driversTotal = await getAllDrivers(); //se llama a la funcion getAllDrivers para tener la lista de los conductores 
    if (name) {
        let driverName = await driversTotal.filter(element => element.nombre.toLowerCase().includes(name.toLowerCase())) 
        res.status(200).send(driverName) ; //busca en los valores q psusite (name) (ign may/min) si encuentra crea un nuevo 
        //arreglo que incluye los valores q pusiste (NAME) y lo envia (res 200 exito)
        res.status(404).send(' No está el driver ');  //si no encuentra error 404 -
    } else {
        res.status(200).send(driversTotal) //si no pusiste nada muestra tods los drivers.-
    }
})

router.get("/drivers/:id", getDriverByID) // ejecuta la función getDriversByID,información sobre un drivers específico identificado por su ID.

module.exports = router;

