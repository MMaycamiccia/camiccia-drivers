import React from "react";
import styles from "./About.module.css"
import { Link } from "react-router-dom";
const img = "../imagenes/logorojo.jpg"

const About = () => {  

    return (
        <div className={styles.about}>
            <div className={styles.card}>
               
                <h1> Nombre: Camiccia Mayra</h1>
                <h2> Proyecto Intgrador: Drivers </h2>
                <h2>Cohorte 42a</h2>
                <p> </p>
                <h2></h2>
                <h2></h2>
                <Link to="/home">
                    <button>HOME</button>
                </Link>
            </div>
        </div>
    )
}

export default About