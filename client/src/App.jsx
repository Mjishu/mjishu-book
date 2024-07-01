import React from 'react';
import Navbar from "./components/generalComponents/Navbar";
import {Link,useNavigate} from "react-router-dom";
import Post from "./components/postComponents/Post.jsx"

function App() {
    const [currentUser, setCurrentUser] = React.useState();
    const [loading, setLoading] = React.useState(true);
    const [allPosts,setAllPosts]= React.useState();
    const navigate = useNavigate();

    React.useEffect(()=>{
        fetch("/api/user/current")
        .then(res => res.json())
        .then(data => data.message !== "none" ? setCurrentUser(data) : console.log(data.message))
        .catch(error => console.error(`there was an error fetching current user ${error}`))
        .finally(() => setLoading(false))
    },[])

    React.useEffect(()=>{
        setLoading(true);

        fetch("/api/post/all")
        .then(res =>res.json())
        .then(data => setAllPosts(data))
        .catch(error => console.error(`error fetching posts ${error}`))
        .finally(()=>setLoading(false))
    },[])

    React.useEffect(() => {
        if(!loading && !currentUser){navigate("/auth")}
    },[currentUser,loading])

    function handleLogout(){
        fetch("/api/user/logout")
        .then(res =>res.json()).then(data => console.log(data))
        .catch(err => console.error(`error logging out ${err}`))
    }

    function handlePostClick(id){
        navigate(`/post/${id}`)
    }

    const allPostsMapped = allPosts?.map(post => {
        const formatedDate = post.createdAt

        return (
            <Post key={post._id} author={post.author.username} body={post.message} time={formatedDate} id={post._id} handleClick={handlePostClick}/>
        )
    })

    if(loading){
        return <p>Loading...</p>
    }

    return (
        <div>
        <Navbar />
        <div>
        <h1>Hello {currentUser?.username}</h1>
        {allPostsMapped}
        {currentUser && <button onClick={handleLogout}>Logout</button>}
        </div>
        </div>
    )
}

export default App
