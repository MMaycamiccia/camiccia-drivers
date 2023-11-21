const { Router } = require("express");
const db = require("../db");
const { getAllDrivers, getDriverByID, postDriver, getTeams } = require('../controllers/index');


const router = Router();

//Acá configuro las rutas, 

router.get('/drivers', getAllDrivers)  //se encarga de obtener y devolver la lista de drivers desde la BD-.
router.get("/drivers/:id", getDriverByID) // se encarga de obtener y devolver información sobre un drivers identificado por su ID.
router.post('/drivers', postDriver) ////  crear un nuevo conductor.-


router.get('/teams', getTeams) // encarga de obtener y devolver una lista teams desde BD.-


module.exports = router;
