import React from "react";
import style from "../../styling/userStyles/userEntry.module.css"
import { useNavigate } from "react-router-dom"

function Signup() {
    const [loginData, setLoginData] = React.useState({
        username: "",
        email: "",
        password: "",
    });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = React.useState(false);
    const [errors, setErrors] = React.useState({
        username: false,
        password: false
    })

    const faEyeSlash = "/icons/eye-crossed.svg";
    const faEye = "/icons/eye.svg";

    React.useEffect(() => {
        if (errors.username) {
            loginData.username.trim().length >= 3 && setErrors(prev => ({ ...prev, username: false }))
        }
        if (errors.password) {
            loginData.password.trim().length >= 5 && setErrors(prev => ({ ...prev, password: false }))
        }
    }, [loginData])

    function handleChange(e) {
        const { name, value } = e.target;
        setLoginData(prevData => ({
            ...prevData,
            [name]: value
        }))
    };

    function autoSignIn() {
        const fetchParams = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: loginData.username, password: loginData.password })

        }
        fetch("/api/user/sign-in", fetchParams)
            .then(res => res.json())
            .then(data => {
                if (data.message === "success") {
                    window.location.href = "/"
                } else {
                    aler(data.message)
                }
            })
            .catch(error => console.error(`error logging user in: ${error}`))
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (loginData.username.trim().length < 3) {
            setErrors(prev => ({ ...prev, username: true }))
            return
        }
        if (loginData.password.trim().length < 5) {
            setErrors(prev => ({ ...prev, password: true }))
            return
        }


        const fetchParams = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData)
        }

        fetch("/api/user/create", fetchParams)
            .then(res => res.json())
            .then(data => data.message === "success" ? autoSignIn() : alert(data.message))
            .catch(err => console.error(`error creating user ${err}`))
    }

    return (
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
                    {errors.username && <span className="error-message">Your username must be atleast 3 characters</span>}
                    <div className={style.usernameHolder}>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" value={loginData.email}
                            className="beautiful-shadow-1"
                            onChange={handleChange} placeholder="Enter your email" />
                    </div>
                    <div>
                        <label htmlFor="password">Password </label>
                        <div className={style.passwordContainer}>
                            <input type={showPassword ? "text" : "password"}
                                name="password" className="beautiful-shadow-1"
                                value={loginData.password} placeholder="Enter your password"
                                onChange={handleChange} />
                            <span className={style.togglePassword} onClick={() => setShowPassword(!showPassword)}>
                                <img alt="toggle password" src={showPassword ? faEyeSlash : faEye} />
                            </span>
                            {errors.password && <span className="error-message">Your password must be atleast 5 characters</span>}
                        </div>
                    </div>
                    <button className={`${style.signInButton} beautiful-shadow-1`}>Sign Up</button>
                </form>
            </div>
        </div>
    )
}

export default Signup
