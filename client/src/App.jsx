import React from 'react';
import Navbar from "./components/generalComponents/Navbar";
import {Link,useNavigate} from "react-router-dom";

function App() {
    console.log("hello")

    React.useEffect(()=>{
        fetch("/api/user/current")
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(`there was an error fetching current user ${error}`))
    },[])

    return (
        <div>
        <Navbar />
        <div>
        <h1>meowllo</h1>
        <Link to="/login">Login</Link>
        <Link to="/sign-up">Sign up</Link>
        </div>
        </div>
    )
}

export default App
