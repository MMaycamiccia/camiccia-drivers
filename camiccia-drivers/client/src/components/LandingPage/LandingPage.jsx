import React from "react";
import { useEffect } from "react";
import { firstCallDrivers } from "../../actions";
import { Link } from "react-router-dom";
import styles from "../LandingPage/LandingPage.module.css"
import { useDispatch } from "react-redux";


export default function LandingPage() {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(firstCallDrivers())
}, [dispatch])

 
    return (
      <div className= {styles.LandingPage}>
<Link to = "/home" >   


<button className={styles.btn}> INGRESAR  </button>


</Link>
      </div>
  )
}
