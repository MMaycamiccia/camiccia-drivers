import { Fragment, React } from "react"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getDrivers, getTeams, filterDriversByDob, filterByName, filterCreated, paginadoGlobal, selectedTeam, firstCallDrivers, filterRestart } from "../../actions"
import { Link } from "react-router-dom"
import Card from "../Card/Card"
import Paginado from "../Paginado/Paginado"
import NavBar from "../NavBar/NavBar"
import styles from "./Home.module.css"


export default function Home() {
    const dispatch = useDispatch()
    const all = useSelector((state) => state.allDrivers)
    const allDrivers = useSelector((state) => state.drivers)        //Traeme todo lo que trae el estado (de drivers) REACT-REDUX
    const allTeams = useSelector((state) => state.teams)
    const currentPageGlobal = useSelector((state) => state.currentPage)
    const filterTeamsHome = useSelector((state) => state.filterTeams)
    const [currentPage, setCurrentPage] = useState(currentPageGlobal)
    const [noCreated, setNoCreated] = useState(false)
    const driversPerPage = 9
    const indexLastDriver = currentPage * driversPerPage 
    const indexFirstDriver = indexLastDriver - driversPerPage 
    const currentDrivers = allDrivers.length ? allDrivers.slice(indexFirstDriver, indexLastDriver) : all.slice(indexFirstDriver, indexLastDriver)
    const noImage = "../imagenes/12.png"



    useEffect(() => {
        dispatch(getDrivers())
    }, [dispatch])



    useEffect(() => {
        dispatch(paginadoGlobal(currentPage));
    }, [dispatch, currentPage]);

    useEffect(() => {
        setCurrentPage(currentPageGlobal);
    }, [currentPageGlobal]);

    useEffect(() => {
        dispatch(getTeams());
    }, []);

    useEffect(() => {
        if (filterTeamsHome.length && !allDrivers.length) {
            setNoCreated(true);
            setTimeout(() => {
                setNoCreated(false);
            }, 3000); // Ocultar el alert después de 3 segundos (puedes ajustar el tiempo según tus necesidades)
        }
    }, [filterTeamsHome, allDrivers]);


    function handleClick(event) {
        event.preventDefault();
        dispatch(getDrivers())
        dispatch(firstCallDrivers())
        dispatch(filterRestart())
        dispatch(paginadoGlobal(1))
    }
    const renderCards = () => {
        return currentDrivers.map((driver) => (
            <div className={styles.card} key={driver.id}>
                <Link to={`/detail/${driver.id}`}>
                    <Card
                        name={`${driver.forename} ${driver.surname}`}
                        image={driver.image ? driver.image : < noImage src="../imagenes/12.png" />}
                        teams={driver.teams || "Toca para ver su equipo"}
                        dob={driver.dob ? driver.dob : ""}
                        createdInDb={driver.createdInDb ? driver.createdInDb : false}
                        Teams={driver.Teams ? driver.Teams : []}

                    />
                </Link>
            </div>
        ));
    };

    function handleSelect(event) {
        const selectedTeamFilter = event.target.value;
        console.log(selectedTeamFilter);

        const filteredDriversAPI = all.filter((driver) => driver.teams && driver.teams.includes(selectedTeamFilter));

        const filteredDriversDb = all.filter((driver) => {
            if (driver.createdInDb && driver.Teams) {
                return driver.Teams.some((team) => team.name.includes(selectedTeamFilter));
            }
            return false;
        });

        console.log(filteredDriversAPI);
        console.log(filteredDriversDb);

        const filteredDrivers = [...filteredDriversAPI, ...filteredDriversDb]

        dispatch(paginadoGlobal(1));
        dispatch(selectedTeam(filteredDrivers));
    }

    function handleFilterDob(event) {
        dispatch(filterDriversByDob(event.target.value))
    }

    function handleFilterName(event) {
        dispatch(filterByName(event.target.value))
    }

    function handleCreated(event) {
        dispatch(filterCreated(event.target.value));
        dispatch(paginadoGlobal(1));
    }

    const handlePaginado = (pageNumber) => {
        dispatch(paginadoGlobal(pageNumber));
        paginado(pageNumber);
    };
    
    function handleDeleteCreatedDrivers() {
  
  dispatch(deleteCreatedDrivers()); 
}

    return (
        <div className={styles.divPadre}>
            {
                location.pathname !== '/'
                    ? <NavBar />
                    : null

            }
            <h1>PI Drivers</h1>

        

            <div className={styles.divSelects}>

                <div className={styles.filtros}>
                    <h4>  Drivers</h4>
                    <select onChange={event => handleCreated(event)}>
                        <option value="All">Todos los drivers</option>
                        <option value="created">Creados</option>
                        <option value="api">Existentes</option>
                    </select>


                    <select onChange={(event) => handleSelect(event)}>
                        <option value="">Todos los equipos</option>
                        {allTeams.map((element) => (
                            <option value={element.name} key={element.id}>
                                {element.name}
                            </option>
                        ))}
                    </select>
               
                {noCreated && (
                    <div className={styles.alertContainer}>
                    <div className={styles.alert}>
                      No se encontraron drivers en la base de datos. 
                      Cree un nuevo driver y reinicie su búsqueda.
                    </div>
                  </div>
                )}
                    <h4>Ordenamiento</h4>
                    <select onChange={event => handleFilterName(event)}>
                        <option value="All">Todos</option>
                        <option value="asc">A - Z</option>        
                        <option value="desc">Z - A</option>
                    </select>

                    <select onChange={event => handleFilterDob(event)}>
                        <option value="ascDob">Mas jovenes primero</option>         
                        <option value="descDob">Mas viejos primero</option>
                    </select>
                </div>





                <button className={styles.botonCargar} onClick={event => { handleClick(event) }}>
                    Mostrar todos los drivers
                </button>
                <div className={styles.cardsContainer}>{renderCards()}</div>
            </div>
      <Paginado driversPerPage={driversPerPage} allDrivers={allDrivers.length ? allDrivers : all} paginado={handlePaginado} currentPage={currentPageGlobal} />

        </div>
    )
}