import React from "react"
import SearchBar from "../SearchBar/SearchBar"
import styles from "./NavBar.module.css"
import { Link, NavLink } from "react-router-dom"

export default function NavBar() {
    return (
        <div className={styles.navBar}>

            <Link to='/'>
                <button className={styles.navBarButton}> LANDING PAGE </button>
            </Link>
            <Link to='/home'>
                <button className={styles.navBarButton}> HOME </button>
            </Link>

            <NavLink to= '/driver'>

           <button className={styles.navBarButton}> CREATE DRIVER </button>
            </NavLink>

            <NavLink to='/about' >
                <button className={styles.navBarButton}> ABOUT </button>
            </NavLink>
            <SearchBar/>
        </div>
    )
}