const axios = require("axios");
const { Driver, Team } = require('../db');
const { where } = require("sequelize");
const noImage = "https://cdn-1.motorsport.com/images/amp/68eyZ1B0/s1000/f1-f1-logo-2017-f1-logo-6693340.jpg"  //imagen por default cuando no se encuentra una en la bd.-
const URL = "http://localhost:5000/drivers"; 


const getAllDrivers = async (req, res) => {
    try {
        let name = req.query.name //buscar driver por nombres.-
        let allDrivers = [] //actua como un contenedor para juntar los datos de dif fuentes (api, bd) antes de enviarlos como res.-

        /* DB */
        const alldriversDb = await Driver.findAll({
            include: {
                model: Team,
                attributes: ["name"],
                through: {
                    attributes: []
                }
            }
        });     // busca todos los conductores incluyendo los equipos en la base de datos y los agrupa en allDrivers.-

        /* API */
        const peticionApi = (await axios(URL)).data;  //hac una peticion a una api ext (url)
        const allDriversApi = peticionApi.map((element) => {    
            const driverImage = element.image ? element.image.url : noImage;
                                  //procesa la info de la api //construye un obj para c/conductor. incluye la sg info:
            return {
                id: element.id,
                forename: element.name.forename,
                surname: element.name.surname,
                description: element.description || "Sin descripción",
                nationality: element.nationality,
                dob: element.dob,
                image: element.image.url || noImage,

                teams: element.teams || "No teams",
            }
        });

        allDrivers = [...allDriversApi, ...alldriversDb]; //combina las inf de  la api y bd y las agrupa en allDrivers.-

        if (name) {
            const searchTerms = name.toLowerCase().split(" ");
            const driversByName = allDrivers.filter((driver) => {
                const fullName = `${driver.forename.toLowerCase()} ${driver.surname.toLowerCase()}`;
                return searchTerms.every((term) => fullName.includes(term));
            }); //si pongo algun valor para (name) busca en los nombres de los conductores y me trae los primeros 15.-
            if (driversByName.length) {
                return res.json(driversByName.slice(0, 15));
            } else {
                throw new Error(`No match found for name: ${name}`);  // si no hay coincidencia me tira un error.- 
            }
        };  

        return res.json(allDrivers); //si no busco nada me devuelbe la lusta completa de los conductores.-

    } catch (error) {
        res.status(500).send(error.message)
    }

}

//esta función maneja la obtención de información sobre conductores desde una base de datos y una API, permitiendo buscar conductores por nombre y respondiendo con la lista de conductores correspondiente o un mensaje de error en caso de problemas.

const getDriverByName = async (name) => { //buscar por parametrso (name)
    try {
        if (name) {
            const driversByName = allDrivers.filter((driver) =>
                driver.forename.toLowerCase().startsWith(name.toLowerCase()));
            if (driversByName.length) {
                return driversByName.slice(0, 15); //si se dio un nombre valido, muestra los primeros 15 resultadosm.-
            } else {
                throw new Error(`No match found for name: ${name}`);
            } //error si no encuentra nada 
        };
    } catch (error) {  
        res.status(500).send(error.message); //error en el proceso  se  maneja y se envía una respuesta de error con un estado 500 y un mensaje de error.-
    }
}

const getDriverByID = async (req, res) => { //info conductor id.- //solicitud y resp q se dara-
    try {
        const { id } = req.params; // obtiene info del conductor por ID.-
        const { data } = await axios.get(`${URL}/${id}`) //obtener info detallada del conductor desde (API)

        let driverDetail = {
            id: id,
            forename: data.name.forename,
            surname: data.name.surname,
            description: data.description || "",
            nationality: data.nationality,
            dob: data.dob,
            image: data.image.url || noImage,
            teams: data.teams
        }; //Cuando se obtiene los datos se crea un obj con toda la info detallada.-
        return driverDetail.forename ? res.json(driverDetail) : res.status(404).send("Not found!"); 
    } catch (error) { //si se encuentra el cond con el id se proporciona la info formato json , sino responde con un error.-
        res.status(500).send(error.message);
    }
}

const postDriver = async (req, res) => { //Funcion asyn que crea un nuevo conductor 
    try { //info para crear conductor si no se cumple algun items , error faltan datos- (no se puede apretar el boton crear)
        const { forename, surname, description, nationality, dob, image, teams, createdInDb } = req.body;
        if (!forename || !surname || !description || !nationality || !dob) throw Error('Faltan datos');

        let [driverCreated, created] = await Driver.findOrCreate({
            where: { forename, surname, description, nationality, dob, image },
            defaults: {
                createdInDb  //valor ppr defecto
            }
        }); //se busca un cond con esos datos si no hay se crea uno.- 

        const teamsDb = await Team.findAll({
            where: { name: teams }
        }); //se busca en la base de datos los equipos se almacenan en teamDb.-

        await driverCreated.addTeams(teamsDb); // se asignan losequipos el cond creado.-

        res.send("Personaje creado"); //si se creo con exito 
    } catch (error) {
        return res.status(500).send(error.message); //si no se se maneja error y se mmanda error 500.-
    }
};


const getTeams = async (req, res) => {
    try {
        // Obtener todos los equipos existentes en la base de datos
        const existingTeams = await Team.findAll();

        // Verificar si ya se han creado los equipos
        if (existingTeams.length > 0) {
            return res.send(existingTeams);
        }

        const teamsApi = await axios.get(URL);
        const teams = teamsApi.data.map((element) => element.teams); //Procesa los datos para obtener una lista de nombres de equipos.


        const listaTeamsPura = [];
        for (let i = 0; i < teams.length; i++) {
            if (teams[i] === undefined) {
                listaTeamsPura.push(["No hay información de equipo"]);
            } else {
                let element = teams[i].split(",");
                listaTeamsPura.push(element);
            }
        }

        const listaTeams = []; //almacena los equipos sin duplicados
        listaTeamsPura.map((element) => {
            for (let i = 0; i < element.length; i++) {
                listaTeams.push(element[i].trim());
            }
        }); // contendrá una lista de nombres de equipos únicos, pero todavía puede haber duplicados.

        const uniqueTeams = [...new Set(listaTeams)]; // elimina duplicados.-

        // Crear los equipos en la base de datos
        const createdTeams = await Team.bulkCreate(
            uniqueTeams.map((name) => ({ name }))
        );

        res.send(createdTeams);
    } catch (error) {
        res.status(500).send(error.message);
    }
};





module.exports = {
    getAllDrivers,
    getDriverByName,
    getDriverByID,
    postDriver,
    getTeams,
}
