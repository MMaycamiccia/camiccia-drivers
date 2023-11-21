import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { postDriver, getTeams } from "../../actions";
import { Link } from "react-router-dom";
import styles from "./Escuderias.module.css"
import Card from "../Card/Card";
import Paginado from "../Paginado/Paginado";
import { paginadoGlobal } from "../../actions";

function validation(input) {
    let errors = {}
    if (!input.forename || !/^[a-zA-Z]+$/.test(input.forename)) {
        errors.forename = "Debe tener un nombre válido";
    }
    return errors;
}

export default function Escuderias() {
    const dispatch = useDispatch();
    const allTeams = useSelector((state) => state.teams);
    const driversTeams = useSelector((state) => state.allDrivers);
    const [errors, setErrors] = useState({});
    const currentPageGlobal = useSelector((state) => state.currentPage)
    const [currentPage, setCurrentPage] = useState(currentPageGlobal)
    const driversPerPage = 9
    const indexLastDriver = currentPage * driversPerPage // 9
    const indexFirstDriver = indexLastDriver - driversPerPage // 0
    const currentDrivers = driversTeams.slice(indexFirstDriver, indexLastDriver)

    const [input, setInput] = useState({
        forename: "",
        teamsArr: [],
        teams: "",
        driversTeamsFiltrados: []
    });

    function handleChange(event) {
        setInput({
            ...input,
            [event.target.name]: event.target.value
        });
        setErrors(validation({
            ...input,
            [event.target.name]: event.target.value
        }));
        console.log(input);
    }

    function handleSelect(event) {
        const selectedTeam = allTeams.find((team) => team.name === event.target.value);
        console.log(event.target.value);

        if (input.teamsArr.length >= 1) {
            alert("El máximo de equipos es 1");
            return;
        }
        
        
        let filtroSelect = [];
        function filtrar() {
            filtroSelect = driversTeams.filter(driver => {
                if (driver.teams && driver.teams.includes(",")) {
                    const auxSplit = driver.teams.split(",");
                    const aux = auxSplit.map(element => element.trim());
                    return aux.includes(event.target.value);
                }
                return false;
            });
        }

        filtrar();

        console.log("filtro select es: " + filtroSelect);

        setInput((prevState) => {
            const teamsArray = [...prevState.teamsArr, selectedTeam];
            const teamsString = teamsArray.map((team) => team.name).join(", ");
            return {
                ...prevState,
                teamsArr: teamsArray,
                teams: teamsString,
                driversTeamsFiltrados: filtroSelect,
            };
        });
    }




    function handleSubmit(event) {
        event.preventDefault();
        alert("Filtros eliminados");
        setInput({
            forename: "",
            teamsArr: [],
            teams: "",
            driversTeamsFiltrados: []
        });
        console.log(`Los equipos a buscar son : ${console.log(input)}`);
    }

    function handleDelete(element) {
        const updatedTeamsArr = input.teamsArr.filter((team) => team !== element);
        const updatedTeamsString = updatedTeamsArr.map((team) => team.name).join(", ");

        setInput((prevState) => ({
            ...prevState,
            teamsArr: updatedTeamsArr,
            teams: updatedTeamsString
        }));
    }

    useEffect(() => {
        dispatch(paginadoGlobal(currentPage));
    }, [dispatch, currentPage]);

    useEffect(() => {
        setCurrentPage(currentPageGlobal);
    }, [currentPageGlobal]);

    useEffect(() => {
        dispatch(getTeams());
    }, []);

    const renderCards = () => {
        return input.driversTeamsFiltrados.map((driver) => (
            <div className={styles.cardContainer} key={driver.id}>
                <Link to={`/detail/${driver.id}`}>
                    <Card
                        name={`${driver.forename} ${driver.surname}`}
           image={driver.image || "../imagenes/12.png"}

                        teams={driver.teams || "Sin teams"}
                    />
                </Link>
            </div>
        ));
    };

    const handlePaginado = (pageNumber) => {
        dispatch(paginadoGlobal(pageNumber));
        paginado(pageNumber);
    };

    return (
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
                        {errors.forename && <p className={styles.errors}>{errors.forename}</p>}

                        <select onChange={(event) => handleSelect(event)}>
                            {allTeams.map((element) => (
                                <option value={element.name} key={element.id}>
                                    {element.name}
                                </option>
                                
                            ))}
               >
                        </select>
                        <Link to="/home">
                <button>Volver</button>
            </Link>
                        <button type="submit">Eliminar filtros</button>
                    </div>
                </form>
                {input.teamsArr.map((element) => (
                    <div key={element.id}>
                        <p></p>
                        <button onClick={() => handleDelete(element)}>x</button>
                        <p>{element.name}</p>
             
                    </div>
                ))}

            
            </div>
            
            <Paginado driversPerPage={driversPerPage} allDrivers={input.driversTeamsFiltrados} paginado={handlePaginado} currentPage={currentPage} />
            <div className={styles.cardsContainer}>{renderCards()}</div>
              
        </div>
    );
}
