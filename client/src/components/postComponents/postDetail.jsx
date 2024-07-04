import React from "react";
import Navbar from "../generalComponents/Navbar";
import {useNavigate} from "react-router-dom";
import style from "../../styling/postStyles/postDetail.module.css"
import {useUser} from "../userComponents/UserContext.jsx"
import DisplayComments from "../commentComponents/DisplayComments"; 
 
function PostDetail(){
    const {currentUser} = useUser();
    const [postData, setPostData] = React.useState();
    const [loading, setLoading] = React.useState(true);
    const[liked,setLiked] = React.useState(false); // set this value based on if currentUser._id in postData.likes
    const navigate = useNavigate();
    const[status,setStatus] = React.useState({
        showDelete : false,
        showEdit: false
    });
    const [editData,setEditData] = React.useState({
        message: "",
        image:"",
    });

    const id = window.location.href.split("/")[window.location.href.split("/").length - 1]

    React.useEffect(()=>{
        fetch(`/api/post/find/${id}`)
        .then(res => res.json())
        .then(data => {
            setPostData(data)
            setEditData(prevData=>({...prevData,message:data.message,image:data?.image}))
        })
        .catch(err => console.error(`error fetching post ${err}`))
        .finally(() => setLoading(false))
    },[])

    if(loading){return <p>Loading... </p>}

    function handleChange(e){
        const {name,value} = e.target;
        setEditData(prevData => ({...prevData, [name]:value}))
    }

    function handleSubmit(e){
        e.preventDefault();
        const fetchParams = {method:'PUT', headers:{"Content-Type":"application/json"}, body:JSON.stringify(editData)}

        fetch(`/api/post/find/${id}/update`, fetchParams)
        .then(res => res.json())
        .then(data => data.message === "success" && location.reload())
        .catch(error => console.error(`error updating post ${error}`))
    }

    function handleLike(){
        const id = currentUser._id

        fetch(`/api/post/find/${postData._id}/like`,{method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:id})})
        .then(res => res.json())
        .then(data => data.message === "success" ? setLiked(true) : console.log(data))
        .catch(error => console.error(`error liking message: ${error}`))
    }

    function handleUnlike(){
        const id = currentUser._id
        fetch(`/api/post/find/${postData._id}/unlike`, {method:'POST',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({id:id})
        })
        .then(res => res.json())
        .then(data => data.message === "success" ? setLiked(false) :console.log(data))
        .catch(error => console.error(`there was an error unliking the post: ${error}`))
    }

    const editItems = (
        <form onSubmit={handleSubmit} className={style.form}>
            <label htmlFor="message">Message</label>
            <textarea className={style.textarea} name="message" value={editData.message} onChange={handleChange}/>
            <div className={style.buttonHolder}>
            <button className={style.button} onClick={() => setStatus(prevStatus => ({...prevStatus,showEdit:false}))}>Cancel</button>
            <button className={style.button}>Submit</button>
            </div>
        </form>
    )

    return (
        <div>
        <Navbar/>
        <div>
            <p>{postData?.message}</p>
            <h3>{postData?.author?.username}</h3>
            <p>{postData?.createdAt}</p>
        </div>
        <button onClick={() => setStatus(prev =>({...prev, showEdit:true}))}>Edit</button>
        <button onClick={() => setStatus(prev => ({...prev, showDelete:true}))}>Delete</button>
        <div className={style.likeHolder}>
            <p>{postData.likes.length} Likes</p>
            <button onClick={handleLike}>Like</button>
            <button onClick={handleUnlike}>Unlike</button>
        </div>
        {status.showDelete && (
            <div>
            <p>Are you sure you want to delete? </p>
            <button onClick={() => setStatus(prevStatus => ({...prevStatus,showDelete:false}))}>Cancel</button>
            <button onClick={() => fetch(`/api/post/find/${id}/delete`,{method:"DELETE"})
                .then(res=>res.json()).then(data=> data.message="success" && navigate("/"))}>Delete 
            </button>
            </div>)}
        {status.showEdit && editItems}
        <DisplayComments postid={postData._id} currentUser={currentUser}/>
        </div>
    )
}

export default PostDetail
