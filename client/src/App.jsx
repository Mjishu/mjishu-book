import React from 'react';
import Navbar from "./components/generalComponents/Navbar";
import {Link,useNavigate} from "react-router-dom";

function App() {
    const [currentUser, setCurrentUser] = React.useState();

    React.useEffect(()=>{
        fetch("/api/user/current")
        .then(res => res.json())
        .then(data => setCurrentUser(data))
        .catch(error => console.error(`there was an error fetching current user ${error}`))
    },[])

    function handleLogout(){
        fetch("/api/user/logout")
        .then(res =>res.json()).then(data => console.log(data))
        .catch(err => console.error(`error logging out ${err}`))
    }

    return (
        <div>
        <Navbar />
        <div>
        <h1>meowllo</h1>
        <Link to="/login">Login</Link>
        <Link to="/sign-up">Sign up</Link>
        {currentUser && <button onClick={handleLogout}>Logout</button>}
        </div>
        </div>
    )
}

export default App
