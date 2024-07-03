import React from "react";
import style from "../../styling/userStyles/profile.module.css";
import Navbar from "../generalComponents/Navbar";
import {useUser} from "./UserContext.jsx"
import {useNavigate} from "react-router-dom"

function Profile(){
    const {currentUser,isLoading} = useUser();
    const [loading,setLoading] = React.useState(true);
    const [postUser,setPostUser] = React.useState();
    const [userPosts,setUserPosts] = React.useState();
    const [status,setStatus] = React.useState({showEdit:false,})
    const [editData,setEditData] = React.useState({
        username:"",
        email:""
    });
    const navigate = useNavigate();

    const id = window.location.href.split("/")[window.location.href.split("/").length - 1]

    React.useEffect(()=>{
        fetch(`/api/post/find/user/${id}`)
        .then(res=>res.json())
        .then(data=> setUserPosts(data))
        .catch(err => console.error(`there was an error fetching user posts: ${err}`))

        fetch(`/api/user/find/${id}`)
        .then(res => res.json())
        .then(data => {
            setPostUser(data)
            setLoading(false)
        })
        .catch(error => console.error(`error fetching post user: ${error}`))

        setEditData(prevData =>({...prevData, username:currentUser?.username, email:currentUser?.email}))
    },[id]);

    function handlePostClick(id){
        navigate(`/post/${id}`)
    }

    const postsMapped = userPosts?.map(post =>{
        return <div key={post._id} onClick={() => handlePostClick(post._id)}>
                <p>{post.message}</p>
                <h3>{post.author.username}</h3>
                <p>{post.createdAt}</p>
            </div>
    })

    function handleSubmit(e){
        e.preventDefault()
        console.log(editData)
        const fetchParams = {method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(editData)}
        
        fetch(`/api/user/find/${id}/update`,fetchParams) //this call isnt being properly made? but submit calls func
        .then(res=>res.json())
        .then(data=> data.message==="success" && location.reload())
        .catch(err=>console.error(`error updating user: ${err}`))
        .finally(()=> setStatus(prev=>({...prev,showEdit:false})))
    }

    function handleChange(e){
        const {name,value} = e.target;
        setEditData(prev => ({...prev, [name]:value}))
    }

    const editInformation = (
        <div className={style.editBack}>
            <form className={style.editInfo} autoComplete="off" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" value={editData?.username} onChange={handleChange}/>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={editData?.email} onChange={handleChange}/>
            <div>
            <button onClick={()=>setStatus(prev=>({...prev,showEdit:false}))}>Cancel</button>
            <button>Submit</button>
            </div>
            </form>
        </div>
    )

    if(loading && isLoading){return <h1>Loading...</h1>}

    return(
        <div>
            <Navbar/>
            <h1>welcome {postUser?.username}</h1>
            <div className={style.postHolder}>
            <h2>Posts</h2>
            {userPosts ? postsMapped : <p>User has no posts</p>}
            </div>
            {currentUser._id === postUser?._id &&<button onClick={() => setStatus(prevStat=>({...prevStat,showEdit:true}))}>Edit Profile</button>}
            {status.showEdit && editInformation}
        </div>
    )
}

export default Profile;
