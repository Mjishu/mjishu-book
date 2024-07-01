import React from 'react';
import Navbar from "./components/generalComponents/Navbar";
import {Link,useNavigate} from "react-router-dom";

function App() {
    const [currentUser, setCurrentUser] = React.useState();
    const [loading, setLoading] = React.useState(true)
    const navigate = useNavigate()

    React.useEffect(()=>{
        fetch("/api/user/current")
        .then(res => res.json())
        .then(data => data.message !== "none" ? setCurrentUser(data) : console.log(data.message))
        .catch(error => console.error(`there was an error fetching current user ${error}`))
        .finally(() => setLoading(false))
    },[])

    React.useEffect(() => {
        if(!loading && !currentUser){navigate("/auth")}
    },[currentUser,loading])

    function handleLogout(){
        fetch("/api/user/logout")
        .then(res =>res.json()).then(data => console.log(data))
        .catch(err => console.error(`error logging out ${err}`))
    }

    if(loading){
        return <p>Loading...</p>
    }

    return (
        <div>
        <Navbar />
        <div>
        <h1>meowllo</h1>
        {currentUser && <button onClick={handleLogout}>Logout</button>}
        </div>
        </div>
    )
}

export default App
