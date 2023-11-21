import React from "react";
import styles from "./Card.module.css";
import { Link } from "react-router-dom";

export default function Card({ name, image, teams, createdInDb, Teams }) {
  


  return (
    <div className={styles.card}>
       
     <div className={styles.card2}>
     <Link to = "/detail/1">
      <button className={styles.btn}> Ver Mas + </button>

      </Link>   
      <h3 className={styles.title}>{name}</h3>
    
      { createdInDb ? 
        <p>{Teams.map((team) => team.name).join(", ")}</p>
        :
        <p>{teams}</p>
      }
      <img src={image} alt="Conductor F1" className={styles.image} />

     
    </div>
    </div>
  );
}