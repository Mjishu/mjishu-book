import React from "react";
import {useNavigate, Link} from "react-router-dom";
import style from "../../styling/generalStyles/navbar.module.css"

function Navbar(){
    const [currentUser,setCurrentUser] = React.useState();
    
    React.useEffect(()=>{
        fetch("/api/user/current")
        .then(res => res.json())
        .then(data => setCurrentUser(data))
        .catch(error => console.error(`error in nav: ${error}`))

    },[])

    return (
        <div className={style.navbar}>
            <Link className={style.navElement} to="/">Home</Link>
            <Link className={style.navElement} to="/messages">Messages</Link>
        <Link className={style.navElement} to="/post/create">Post</Link>
            <Link className={style.navElement} to={`/profile/${currentUser?._id}`}>Profile</Link>
        </div>
    )
}

export default Navbar
