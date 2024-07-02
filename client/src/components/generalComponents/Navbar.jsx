import React from "react";
import {useNavigate, Link} from "react-router-dom";
import style from "../../styling/generalStyles/navbar.module.css";
import {useUser} from "../userComponents/UserContext.jsx"

function Navbar(){
    const {currentUser, loading} = useUser();

    if(loading){return <p>Loading... </p>}

    return (
        <div className={style.navbar}>
            <Link className={style.navElement} to="/">Home</Link>
            <Link className={style.navElement} to="/messages">Messages</Link>
            <Link className={style.navElement} to="/post/create">Post</Link>
            <Link className={style.navElement} to={`/profile/${currentUser?._id}`}>Profile</Link>
        </div>
    )
}

export default Navbar;
