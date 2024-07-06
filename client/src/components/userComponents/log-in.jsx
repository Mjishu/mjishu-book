import React from "react";
import style from "../../styling/userStyles/userEntry.module.css";
import {useNavigate,Link} from "react-router-dom";
import {useUser} from "./UserContext.jsx";

function LogIn(){
    const [loginData,setLoginData] = React.useState({
        username: "",
        password: ""
    });
    const navigate = useNavigate();
    const {setCurrentUser} = useUser();
    const [showPassword,setShowPassword] = React.useState(false);

    const faEyeSlash = "/icons/eye-crossed.svg";
    const faEye = "/icons/eye.svg";

    function handleChange(e){
        const {name,value} = e.target;
        setLoginData(prevData => ({
            ...prevData,
            [name]: value
        }))
    };

    function handleSubmit(e){
        e.preventDefault();
        const fetchParams ={
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify(loginData)
        };

        fetch("/api/user/sign-in",fetchParams)
            .then(res => res.json())
            .then(data => {
                if(data.message === "success"){
                    setCurrentUser(data.user)
                    navigate("/")}
            })
            .catch(error => console.error(`error making sigin in call ${error}`))
    }

    return(
        <div className={style.content}>
        <div className={style.loginImage}></div>
        <div className={style.loginDetails}>
        <header className={style.header}>
        <img src="" alt="logo"/>
        <h1>Mjishu Book </h1>
        </header>
        <form className={style.form} onSubmit={handleSubmit} autoComplete="off">
        <h3>Welcome Back!</h3>
        <div className={style.usernameHolder}>
        <label htmlFor="username">Username</label>
        <input type="text" 
        name="username" 
        value={loginData.username} placeholder="Enter your username"
        className="beautiful-shadow-1"
        onChange={handleChange} />
        </div>
        <div>
        <label htmlFor="password">Password</label>
        <div className={style.passwordContainer}>
        <input type={showPassword ? "text" : "password"}
        name="password"
        className="beautiful-shadow-1"
        value={loginData.password} placeholder="Enter your password"
        onChange={handleChange} />
        <span className={style.togglePassword} onClick={() => setShowPassword(!showPassword)}>
        <img alt="toggle password" src={showPassword ? faEyeSlash : faEye}/>
        </span>
        </div>
        </div>
        <div className={style.signInHolder}>
        <button className={`${style.signInButton} beautiful-shadow-1`}>Log In</button>
        <button className={`${style.alternateSignIn} beautiful-shadow-1`}>Sign in with SITE</button>
        </div>
        </form>
        </div>
        <footer>Don't have an account?<Link className={style.signUp} to="/sign-up">Sign Up</Link></footer>
        </div>
    )
}

export default LogIn
