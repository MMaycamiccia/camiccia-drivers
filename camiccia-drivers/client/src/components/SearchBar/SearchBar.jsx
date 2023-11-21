import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getNameDrivers, paginadoGlobal } from "../../actions";
import styles from "./SearchBar.module.css";

export default function SearchBar() {
    const dispatch = useDispatch();
    const [name, setName] = useState("");

    const handleInputChange = (element) => {
        element.preventDefault();
        setName(element.target.value);
    }

    function handleSubmit(element) {
        element.preventDefault();
        dispatch(getNameDrivers(name));
        dispatch(paginadoGlobal(1));
    }

    function handleClearSearch() {
        
        setName(""); 
        dispatch(getNameDrivers("")); 
    }

    return (
        <div className={styles.searchBar}>
            <input
                className={styles.barraBusqueda}
                type="text"
                placeholder="Buscar driver..."
                value={name}
                onChange={(element) => handleInputChange(element)}
            />
            <button className={styles.botonSearch} type="submit" onClick={(element) => handleSubmit(element)}>Buscar</button>
            <button className={styles.botonSearch} onClick={handleClearSearch}>Borrar</button>
        </div>
    )
}
