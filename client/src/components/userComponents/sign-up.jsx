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
    const [showPassword, setShowPassword] = React.useState(false);

    const faEyeSlash = "/icons/eye-crossed.svg";
    const faEye = "/icons/eye.svg"

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
        <div className={style.loginImage}></div>
        <div className={style.signupDetails}>
        <header className={style.header}>
            <img src="" alt="logo" />
            <h1>Mjishu Book</h1>
        </header>
        <form className={style.form} onSubmit={handleSubmit} autoComplete="off">
        <h3>Welcome!</h3>
        <div className={style.usernameHolder}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" 
        className="beautiful-shadow-1"
        value={loginData.username} onChange={handleChange} placeholder="Enter your username" />
        </div>
        <div className={style.usernameHolder}>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" value={loginData.email} 
        className="beautiful-shadow-1"
        onChange={handleChange} placeholder="Enter your email"/>
        </div>
        <div>
        <label htmlFor="password">Password </label>
        <div className={style.passwordContainer}>
        <input type={showPassword ? "text" : "password"}
        name="password" className="beautiful-shadow-1"
        value={loginData.password} placeholder="Enter your password"
        onChange={handleChange} />
        <span className={style.togglePassword} onClick={() => setShowPassword(!showPassword)}>
        <img alt="toggle password" src={showPassword ? faEyeSlash : faEye}/>
        </span>
        </div>
        </div>
        <button className={`${style.signInButton} beautiful-shadow-1`}>Sign Up</button>
        </form>
        </div>
        </div>
    )
}

export default Signup
