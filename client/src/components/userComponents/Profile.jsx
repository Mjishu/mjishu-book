import React from "react";
import style from "../../styling/userStyles/profile.module.css";
import Navbar from "../generalComponents/Navbar"

function Profile(){
    const [currentUser,setCurrentUser] = React.useState();
    const [loading,setLoading] = React.useState(true);
    const [userPosts,setUserPosts] = React.useState();
    const [status,setStatus] = React.useState({showEdit:false,})
    const [editData,setEditData] = React.useState({
        username:"",
        email:""
    });

    React.useEffect(() => {
        fetch("/api/user/current")
        .then(res => res.json())
        .then(data => {
            setCurrentUser(data)
            setEditData(prev=>({...prev, username:data.username, email:data.email}))
            setLoading(false)
        })
        .catch(err => console.error(`error fetching user ${err}`))
    },[])

    React.useEffect(()=>{
        currentUser && fetch(`/api/post/find/user/${currentUser._id}`)
        .then(res=>res.json())
        .then(data=> setUserPosts(data))
        .catch(err => console.error(`there was an error fetching user posts: ${err}`))
    },[currentUser]);

    const postsMapped = userPosts?.map(post =>{
        return <div key={post._id}>
                <p>{post.message}</p>
                <h3>{post.author.username}</h3>
                <p>{post.createdAt}</p>
            </div>
    })

    function handleSubmit(e){
        e.preventDefault()
        console.log(editData)
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

    if(loading){return <h1>Loading...</h1>}

    return(
        <div>
            <Navbar/>
            <h1>welcome {currentUser?.username}</h1>
            <div className={style.postHolder}>
            <h2>Posts</h2>
            {userPosts ? postsMapped : <p>User has no posts</p>}
            </div>
            <button onClick={() => setStatus(prevStat=>({...prevStat,showEdit:true}))}>Edit Profile</button>
            {status.showEdit && editInformation}
        </div>
    )
}

export default Profile;
