import React from "react";
import style from "../../styling/userStyles/profile.module.css";
import Navbar from "../generalComponents/Navbar";
import {useUser} from "./UserContext.jsx"
import {useNavigate} from "react-router-dom"
import {format} from "date-fns"
import Post from "../postComponents/Post.jsx"

function Profile(){
    const {currentUser,isLoading} = useUser();
    const [loading,setLoading] = React.useState(true);
    const [profileUser,setProfileUser] = React.useState();
    const [userPosts,setUserPosts] = React.useState();
    const [status,setStatus] = React.useState({showEdit:false,})
    const [editData,setEditData] = React.useState({
        username:"",
        email:""
    });
    const [followStatus,setFollowStatus] = React.useState({
        showFollowers: false,
        showFollowing: false
    })
    const [recommendedUsers, setRecommendedUsers] = React.useState({})
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
                setProfileUser(data)
                setLoading(false)
            })
            .catch(error => console.error(`error fetching post user: ${error}`))

        fetch('/api/user/find')
        .then(res => res.json())
        .then(data => setRecommendedUsers(data))
        .catch(error => console.error(`error fetching recommended user:${error}`))
    },[id]);

    React.useEffect(()=>{
        setEditData(prevData =>({...prevData, username:profileUser?.username, email:profileUser?.email}))
    },[profileUser])

    function handlePostClick(id){
        navigate(`/post/${id}`)
    }

    const postsMapped = userPosts?.map(post =>{
        const formatedDate = format(post.createdAt ,"do MMMM")

        return <Post currentUser={currentUser} key={post._id}
            author={post.author.username} body={post.message}
            time={formatedDate} id={post._id} handleClick={handlePostClick}
            likes={post.likes}/>
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
        <div className="dialogBackdrop">
        <div className={`${style.editBack} editBoard`}>
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
        </div>
    )

    function unfollowUser(id){
        fetch(`/api/user/find/${id}/unfollow`,{method:"POST",headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:profileUser._id})})
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.error(`there was an error trying to unfollow user: ${error}`))
    }
    function followUser(){
        fetch(`/api/user/find/${id}/follow`, {method:"POST", headers:{'Content-Type':"application/json"},
        body:JSON.stringify({id:profileUser._id})})
        .then(res => res.json()).then(data => console.log(data))
        .catch(error => console.error(`error trying to follow user`))
    }

    function ShowsFollowing(){
        const followingMapped = profileUser.following.map(user => {
            return (
                <div key={user._id}>
                <h6>{user.username}</h6>
                {currentUser._id === profileUser._id && <button onClick={() => unfollowUser(user._id)}>unfollow</button>}
                </div>
            )
        })
        return (
            <div className="dialogBackdrop">
            <div className={`${style.followInformation} editBoard`}>
            {followingMapped}
            <button onClick={()=> setFollowStatus(prev=>({...prev,showFollowing:false}))}>Close</button>
            </div>
            </div>
        )
    }

    function ShowsFollowers(){
        const followersMapped = profileUser.followers.map(user =>{
            return (
                <div key={user._id} >
                <h6>{user.username}</h6>
                </div>
            )
        });
        return (
            <div className="dialogBackdrop">
            <div className={`${style.followInformation} editBoard`}>
            {followersMapped}
            <button onClick={() => setFollowStatus(prev=>({...prev,showFollowers:false}))}>Close</button>
            </div>
            </div>
        )
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

    if(loading && isLoading){return <h1>Loading...</h1>}

    const recommendedMapped = recommendedUsers?.length > 0 && recommendedUsers.filter(user => 
        !currentUser.following.includes(user._id)).slice(0,3).map(user=>{
        return(
            <div key={user._id} className={style.userMapped}>
                <h5 onClick={() => navigate(`/profile/${user._id}`)}>{user.username}</h5>
                <button onClick={() => followUser(user._id)}>Follow</button>
            </div>
        )
    })

    return(
        <div className="content">
        <Navbar/>
        <div className={style.bodyHolder}>
        <div className={style.bodyInfo}>
        <header className={style.header}>
        <div className={style.profilePicture}></div>
        <div className={style.userText}>
        <h1 className={style.username}>{profileUser?.username}</h1>
        <div className={style.followHolder}>
        <h5 onClick={() => setFollowStatus(prev =>({...prev, showFollowers:true}))}>{currentUser.followers?.length}Followers</h5>
        <h5 onClick={() => setFollowStatus(prev => ({...prev,showFollowing:true}))}>{currentUser.following?.length}Following</h5>
        </div>
        <div className={style.detailsHolder}>
        <p>{currentUser?.details?.location ? currentUser.details.location : "Unknown" }</p>
        <p>{currentUser?.details?.bio}</p>
        </div>
        </div>
        </header>
        <div className={style.postHolder}>
        {userPosts ? postsMapped : <p>User has no posts</p>}
        </div>
        <div className={style.recommendedHolder}>
        <h3>Recommended</h3>
        {recommendedMapped}
        </div>
        {currentUser?._id === profileUser?._id &&<button 
            onClick={() => setStatus(prevStat=>({...prevStat,showEdit:true}))}>Edit Profile
        </button>}
        {status.showEdit && editInformation}
        {followStatus.showFollowing && ShowsFollowing()}
        {followStatus.showFollowers && ShowsFollowers()}
        <button onClick={handleLogout}>Logout</button>
        </div>
        </div>
        </div>
    )
}

export default Profile;
