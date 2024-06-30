import React from "react";
import {useNavigate, Link} from "react-router-dom";
import style from "../../styling/generalStyles/navbar.module.css"

function Navbar(){
    return (
        <div className={style.navbar}>
            <Link className={style.navElement} to="/">Home</Link>
            <Link className={style.navElement} to="#">Messages</Link>
            <Link className={style.navElement} to="/profile">Profile</Link>
        </div>
    )
}

export default Navbar
