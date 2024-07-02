import React from 'react';
import Navbar from "./components/generalComponents/Navbar";
import {Link,useNavigate} from "react-router-dom";
import Post from "./components/postComponents/Post.jsx"
import {useUser} from "./components/userComponents/UserContext.jsx"

function App() {
    const {currentUser, setCurrentUser,isLoading} = useUser();
    const [postsLoading, setPostsLoading] = React.useState(true);
    const [allPosts,setAllPosts]= React.useState();
    const navigate = useNavigate();

    React.useEffect(() => {
        if(!isLoading){
            if(!currentUser || currentUser.message === "none"){
                navigate("/auth")
            }else{
                fetchPosts();
            }
        }
    },[currentUser,isLoading,navigate])

    function fetchPosts(){
        setPostsLoading(true);

        fetch("/api/post/all")
        .then(res =>res.json())
        .then(data => setAllPosts(data))
        .catch(error => console.error(`error fetching posts ${error}`))
        .finally(()=>setPostsLoading(false))
    };


    function handleLogout(){
        fetch("/api/user/logout")
        .then(res =>res.json())
        .then(data => {
            setCurrentUser(null);
            data.message === "success" && navigate("/auth");
        })
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

    if(postsLoading || isLoading){
        return <p>Loading...</p>
    }

    return (
        <div>
        <Navbar />
        <div>
        <h1>Hello {currentUser?.username}</h1>
        {allPostsMapped}
        <button onClick={handleLogout}>Logout</button>
        </div>
        </div>
    )
}

export default App
