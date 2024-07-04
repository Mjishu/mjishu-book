import React from 'react';
import Navbar from "./components/generalComponents/Navbar";
import {Link,useNavigate, useLocation} from "react-router-dom";
import Post from "./components/postComponents/Post.jsx"
import {useUser} from "./components/userComponents/UserContext.jsx"


function App() {
    const {currentUser, setCurrentUser,isLoading} = useUser();
    const [postsLoading, setPostsLoading] = React.useState(true);
    const [allUsers,setAllUsers] = React.useState();
    const [allPosts,setAllPosts]= React.useState();
    const navigate = useNavigate();
    const [showFollowing, setShowFollowing] = React.useState(false);

    React.useEffect(() => {
        if(!isLoading ){ //user signed in on signup but since this is already at false,thinks usre not exist
            if(!currentUser || currentUser.message === "none"){
                console.log("we have to redirect to auth:(")
                navigate("/auth")
            }else{
                fetchPosts();
                fetchAllUsers();
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

    function fetchAllUsers(){
        fetch("/api/user/find")
        .then(res => res.json())
        .then(data=>setAllUsers(data))
        .catch(error => console.error(`there was an error trying to fetch all users: ${error}`))
    }


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

    function handleUserClick(id){
        navigate(`/profile/${id}`)
    }

    function follow(id){
        console.log("follow")
        fetch(`/api/user/find/${id}/follow`,
            {method:"POST",headers:{"Content-Type":"application/json"},
                body:JSON.stringify({id:currentUser._id})})
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(`error following user: ${error}`))
    }

    function unfollow(id){
        console.log('unfollow')
        fetch(`/api/user/find/${id}/unfollow`,{method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:currentUser._id})})
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(`error following user: ${error}`))
    }

    const allPostsMapped = allPosts?.map(post => {
        const formatedDate = post.createdAt

        return (
            <Post key={post._id} author={post.author.username} body={post.message} time={formatedDate} id={post._id} handleClick={handlePostClick}/>
        )
    })

    const followPostsMapped = allPosts?.filter(post => currentUser.following.includes(post.author._id)).map(post =>{
        return (
            <div key={post._id}>
                <p>{post.message}</p>
                <h6>{post.author.username}</h6>
                <p>{post.createdAt}</p>
            </div>
        )
    })

    const allUsersMapped = allUsers?.filter(user => !currentUser.following.includes(user._id)).map(user=>{
        return(
            <div key={user._id} >
                <h5 onClick={() => handleUserClick(user._id)}>{user.username}</h5>
                <button onClick={() => follow(user._id)}>Follow</button>
                <button onClick={() => unfollow(user._id)}>Unfollow</button>
            </div>
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
        <div>
        <button onClick={() => setShowFollowing(false)}>Explore</button>
        <button onClick={() => setShowFollowing(true)}>Following</button>
        </div>
        {showFollowing ? followPostsMapped :allPostsMapped}
        {allUsersMapped}
        <p>You follow {currentUser?.following.length} people and {currentUser?.followers.length} people follow you</p>
        <button onClick={handleLogout}>Logout</button>
        </div>
        </div>
    )
}

export default App
