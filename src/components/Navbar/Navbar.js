import React from "react"
import style from "./Navbar.module.css"
import {NavLink} from "react-router-dom"


const Navbar = () => {
    return (
        <div className={style.Navbar}>
            <div className={style.Menu}><NavLink to={"menu"}>Меню</NavLink></div>
            <div className={style.Label}><NavLink to={"/"}>Threesby</NavLink></div>
            <div className={style.Search}><NavLink to={"/search"}>Поиск</NavLink></div>
        </div>
    )
}

export default Navbar