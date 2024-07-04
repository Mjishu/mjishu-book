import React from "react";
import style from "../../styling/userStyles/userEntry.module.css"
import {useNavigate} from "react-router-dom"

function Signup(){
    const [loginData,setLoginData] = React.useState({
        username: "",
        email:"",
        password: "",
    });
    const navigate = useNavigate();

    function handleChange(e){
        const {name,value} = e.target;
        setLoginData(prevData => ({
            ...prevData,
            [name]: value
        }))
    };

    function autoSignIn(){
        const fetchParams = {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username:loginData.username,password:loginData.password})

        }
        fetch("/api/user/sign-in",fetchParams)
        .then(res => res.json())
        .then(data => data.message === "success" && navigate("/"))
        .catch(error => console.error(`error logging user in: ${error}`))
    }

    function handleSubmit(e){
        e.preventDefault();
        const fetchParams={
            method:"POST",
            headers:{"Content-Type": "application/json"},
            body: JSON.stringify(loginData)
        }

        fetch("/api/user/create", fetchParams)
        .then(res => res.json())
        .then(data => data.message === "success" && autoSignIn())
        .catch(err => console.error(`error creating user ${err}`))
    }

    return(
        <div className={style.content}>
            <form className={style.form} onSubmit={handleSubmit} autoComplete="off">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" value={loginData.username} onChange={handleChange} />
                <label htmlFor="email">Email</label>
                <input type="email" name="email" value={loginData.email} onChange={handleChange}/>
                <label htmlFor="password">Password</label>
                <input type="password" name="password" value={loginData.password} onChange={handleChange} />
                <button>Log In</button>
            </form>
        </div>
    )
}

export default Signup
