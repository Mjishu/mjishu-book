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
    const [errors,setErrors] = React.useState({
        username: false,
        password:false,
    })

    const faEyeSlash = "/icons/eye-crossed.svg";
    const faEye = "/icons/eye.svg";

    React.useEffect(() => {
        if(errors.username){
            loginData.username.trim().length >= 3 && setErrors(prev => ({...prev,username:false}))
        }
        if(errors.password){
            loginData.password.trim().length >= 5 && setErrors(prev => ({...prev,password:false}))
        }
    },[loginData])

    function handleChange(e){
        const {name,value} = e.target;
        setLoginData(prevData => ({
            ...prevData,
            [name]: value
        }))
    };

    function handleSubmit(e){
        e.preventDefault();
    
        if(loginData.username.trim().length < 3){
            setErrors(prev => ({...prev, username:true}))
            return
        }
        if(loginData.password.trim().length < 5){
            setErrors(prev =>({...prev, password:true}))
            return
        }


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

    function handleDummyAccount(){
        const fetchParams = {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                username:"Demo",
                password:"Demo"
            })
        }
        fetch("/api/user/sign-in", fetchParams)
        .then(res => res.json())
        .then(data => {
            if(data.message === "success"){
                setCurrentUser(data.user)
                navigate("/")}
        })
        .catch(error => console.error(`error trying to use demo account! ${error}`))
    }

    function handleGithub(){
        console.log("calling handle git")
        window.location.href = "https://mjishu-book-api.onrender.com/api/user/github";
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
        {errors.username && <span className="error-message">Your username needs to be atleast 3 characters</span>}
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
        {errors.password && <span className="error-message">Your password must be atleast 5 characters</span>}
        </div>
        </div>
        <div className={style.signInHolder}>
        <button className={`${style.signInButton} beautiful-shadow-1`}>Log In</button>
        <button onClick={handleDummyAccount} className={`${style.signInButton} beautiful-shadow-1`}>Log in as demo user</button>
        <button onClick={handleGithub} className={`${style.alternateSignIn} beautiful-shadow-1`}>Sign in with github</button>
        </div>
        </form>
        </div>
        <footer>Don't have an account?<Link className={style.signUp} to="/sign-up">Sign Up</Link></footer>
        </div>
    )
}

export default LogIn
