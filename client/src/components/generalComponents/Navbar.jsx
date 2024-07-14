import React from "react";
import {useNavigate, Link} from "react-router-dom";
import style from "../../styling/generalStyles/navbar.module.css";
import {useUser} from "../userComponents/UserContext.jsx"

function Navbar(){
    const {currentUser, loading} = useUser();
    const navigate = useNavigate();

    if(loading){return <p>Loading... </p>}

    return (
        <div className={style.navbar}>
            <img src="/Logo.png" alt="logo" className={style.logo} onClick={() => navigate("/")}/>
            <div className={style.pageLinks}>
            <Link className={style.navElement} to="/"><img alt="home" src="/icons/house-blank.svg"/></Link>
            <Link className={style.navElement} to="/messages"><img alt="messages" src="/icons/messages.svg"/></Link>
            <Link className={style.navElement} to="/post/create"><img alt="Post" src="/icons/picture.svg"/></Link>
            </div>
            <Link className={`${style.navElement} ${style.profile}`} to={`/profile/${currentUser?._id}`}><img alt="Profile" src="/icons/user.svg"/></Link>
        </div>
    )
}

export default Navbar;
