import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postDriver, getTeams, filterRestart } from "../../actions";
import { Link } from "react-router-dom";
import styles from "./DriverCreate.module.css"

function validation(input) {
    let errors = {} // se almacen los errores (obejto) si no se cumple algun criterio-
    if (!input.forename || !/^(?:[A-Z][a-zA-Z]*)(?: [A-Z][a-zA-Z]*){0,2}$/.test(input.forename)) {
        errors.forename = "Debe tener un nombre válido con la primera letra mayúscula y permitir nombres compuestos de hasta 255 caracteres."
    } else if (!input.surname || !/^(?:[A-Z][a-zA-Z]*)(?:-[A-Z][a-zA-Z]*){0,1}$/.test(input.surname)) {
        errors.surname = "Debe tener apellido valido, con primera letra mayúscula. Permite compuestos separados por un guión (-)"
    } else if (!input.nationality || !/^[a-zA-Z]+$/.test(input.nationality)) {
        errors.nationality = "Debe ingresar un país valido"
    } else if (!input.dob || !/\b(18[5-9][0-9]|19[0-9]{2}|20[0-2][0-9]|2023)-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])\b/.test(input.dob)) {
        errors.dob = `[Formato AÑO-MES-DIA] Dia: 1 - 31 // Mes: 1 - 12 // Año: 1850 - 2023 `
    } else if (!input.description) {
        errors.description = "Debe tener descripción"
    } else if (!input.image) {
        errors.image = "Debe tener fecha de image"
    }
    return errors;
}

export default function DriverCreate() {
    const dispatch = useDispatch() //actualiza etsado de la app.-
    const allTeams = useSelector((state) => state.teams)
    const [errors, setErrors] = useState({})

    const [input, setInput] = useState({
        forename: "",
        surname: "",
        description: "",
        nationality: "",
        dob: "",
        image: "https://cdn-1.motorsport.com/images/amp/68eyZ1B0/s1000/f1-f1-logo-2017-f1-logo-6693340.jpg",
        createdInDb: true,
        teamsArr: [], // Nueva propiedad aux, actualiza el array de equipos
        formSubmitted: false
    });

    function handleChange(event) { //cuando se produce un cambio en el formulario
        console.log(input); //estado actual obj imput (sin cambios)
        setInput({ //actuliza cambios (setInput)
            ...input, //copia los valores act 
            [event.target.name]: event.target.value //se act el valor especifico q se modifico
        }) 
        setErrors(validation({
            ...input,
            [event.target.name]: event.target.value
        })) // se pása la copia act del input a la funcion validation para q valide si hay errores en los camhios realizados
        //setError actualiza el estado error con los msj de errores resultantes.-
    }
 //*en resumen esta funcion registra los cambios en el formulario, actualiza el estado con los nuevos valores
 //y realiza las validaciones para ver si hay errores en algun campo del formulario (SI HAY LOS MUESTRA)
    




    function handleSubmit(event) { // 
        event.preventDefault(); //evita el comportamiento predeterminado de formumulario (recarga la pag cuando se envia)
        setErrors(validation(input)); //valida los datos ingresados (x el usua) si hay errores los almacena en el stadoo error.-
        setInput((prevInput) => ({ ...prevInput, formSubmitted: true })); //se envio el formuario (act estado input) estableciendo la prop true.-
    //se verifica q no haya errores en el obj (errors) osea todos los datos ing son validos, se asegura q todos los campos esten llenos
        if (Object.keys(errors).length === 0 && input.forename !== "" && input.surname !== "" && input.nationality !== "" && input.dob !== "" && input.description !== "" && input.image !== "") {
        //si esta toodo ok se crea el conductor.-
            const teamNames = input.teamsArr.map((team) => team.name); // Extrae solo los name de teams (selecc usua)
//
            dispatch(postDriver({ ...input, teams: teamNames })); //se envia una accion al estado global (redux) para crear un conductor con todos los datos ingresados // Pasa los names de los equipos en lugar de input.teamsArr
            dispatch(filterRestart()) //se envia una accion para restablever los filtros 
            alert("Driver creado\nFiltros restablecidos"); //alerta q se creo el cond y se reinicia el formulacrio
            setInput({ //se restauran los sig datos 
                forename: "",
                createdInDb: true,
                surname: "",
                nationality: "",
                dob: "",
                description: "",
                image: "",
                teamsArr: [],
                formSubmitted: false
            });
        } else {
            alert("Debe ingresar todos los datos."); // si algo no se lleno se tIRA ALERTA
        }
    }

   // se encarga de validar y procesar los datos del formulario para crear un nuevo conductor, 
   //siempre y cuando se cumplan ciertos criterios de validacion.-


    function handleDelete(element) { // elimina un elemento (equipo ) de la lista
        const updatedTeamsArr = input.teamsArr.filter((team) => team !== element);//crea una nueva lsta (up,.) q excluye el equipo (element) q se desea eliminar de la lista
//de equipos seleccionads
        setInput((prevState) => ({ //se actualiza el estad input utilizano setInpu con el elemen ya eliminado
            ...prevState, //se mantiene todo el estado
            teamsArr: updatedTeamsArr // exepto teamsArrs que se act por upsatedTeamsArr
        }));
    }
 // elimina un equipo específico de la lista de equipos seleccionados del conductor, y actualiza el estado para reflejar esta eliminación.

    useEffect(() => {   //disp envia una acc al estado global (redux)  para cargar los equipos 
        dispatch(getTeams()) // se encarga de recuperar los datos de los equipos de la API o de otro lugar.
    }, []) //se va a ejecutar una vez [].-
////este useEffect se ejecuta una sola vez cuando el componente se monta y llama a getTeams() a través de dispatch para cargar la lista de equipos.
        // Esto asegura que los equipos estén disponibles para su selección cuando el usuario crea un nuevo conductor en la aplicación.
    return ( //es la parte visual del formulario
    // los campos a llenar por el usua (input) para q puedan llanarlos. los value (cualqier cambio se act en el estado
        <div className={styles.divPadre}>  
          
            <div className={styles.card}>
                <h1>Crea tu driver</h1> 
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className={styles.column}>
                        <label>Nombre:</label>
                        <input
                            type="text"
                            value={input.forename}
                            name="forename"
                            onChange={(event) => handleChange(event)}
                        />
                        {
                            errors.forename && (<p className={styles.errors}>{errors.forename}</p>)
                        }
                        <label>Apellido:</label>
                        <input
                            type="text"
                            value={input.surname}
                            name="surname"
                            onChange={(event) => handleChange(event)}
                        />
                        {
                            errors.surname && (<p className={styles.errors}>{errors.surname}</p>)
                        }
                        <label>Nacionalidad:</label>
                        <input
                            type="text"
                            value={input.nationality}
                            name="nationality"
                            onChange={(event) => handleChange(event)}
                        />
                        {
                            errors.nationality && (<p className={styles.errors}>{errors.nationality}</p>)
                        }
                        <label>Fecha de Nacimiento:</label>
                        <input
                            type="text"
                            value={input.dob}
                            name="dob"
                            onChange={(event) => handleChange(event)}
                        />
                        {
                            errors.dob && (<p className={styles.errors}>{errors.dob}</p>)
                        }
                        <label>Descripción:</label>
                        <input
                            type="text"
                            value={input.description}
                            name="description"
                            onChange={(event) => handleChange(event)}
                        />
                        {
                            errors.description && (<p className={styles.errors}>{errors.description}</p>)
                        }
                        <label>Imagen:</label>
                        <input
                            type="text"
                            value={input.image}
                            name="image"
                            onChange={(event) => handleChange(event)}
                        />
                        {
                            errors.image && (<p className={styles.errors}>{errors.image}</p>)
                        }

                        {/* Agrega el elemento img para mostrar la imagen por defecto */}
                                <img src={input.image} alt="Imagen por defecto" width="100" height="100" />
                        <select onChange={(event) => handleChange(event)}>
                            {allTeams.map((element) => (
                                <option value={element.name} key={element.id}>
                                    {element.name}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className={Object.keys(errors).length > 0 || input.forename === "" ? styles.disabledButton : ""}
                            disabled={Object.keys(errors).length > 0}
                        >
                            Crear Driver
                        </button>
                        <Link to="/home">
                <button>Volver</button>
            </Link>
                    </div>
                </form>
             
                <div className={`${styles.teamsList} ${styles.column}`}>
                    {input.teamsArr.map((element) => (
                        <div key={element.id}>
                            <p>{element.name}</p>
                            <button onClick={() => handleDelete(element)}>x</button>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}