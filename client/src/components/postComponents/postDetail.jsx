import React from "react";
import Navbar from "../generalComponents/Navbar";
import {useNavigate} from "react-router-dom";
import style from "../../styling/postStyles/postDetail.module.css"
import {useUser} from "../userComponents/UserContext.jsx"
import DisplayComments from "../commentComponents/DisplayComments"; 
import {format} from "date-fns"

function PostDetail(){
    const {currentUser, currentUserRef,isLoading} = useUser();
    const [postData, setPostData] = React.useState();
    const [postLikes,setPostLikes] = React.useState();
    const [liked,setLiked] = React.useState();
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();
    const[status,setStatus] = React.useState({
        showDelete : false,
        showEdit: false
    });
    const [editData,setEditData] = React.useState({
        message: "",
        image:"",
    });
    const [cloud, setCloud] = React.useState();
    const fileInputRef = React.useRef(null)

    const id = window.location.href.split("/")[window.location.href.split("/").length - 1]

    React.useEffect(()=>{
        !isLoading && fetch(`/api/post/find/${id}`)
            .then(res => res.json())
            .then(data => {
                setPostData(data);
                setEditData(prevData=>({...prevData,message:data.message,image:data?.image}));
                setLiked(data.likes.some(like => like._id === currentUser._id));
                setPostLikes(data.likes?.length);
            })
            .catch(err => console.error(`error fetching post ${err}`))
            .finally(() => setLoading(false))

        fetch("/api/uploadform")
        .then(res => res.json()).then(data=>setCloud(data))
        .catch(error => console.error(`error: ${error}`))
    },[id,currentUser,liked])

    function handleChange(e){
        const {name,value, files,type} = e.target;
        setEditData(prevData => ({...prevData, [name]:type==="file"? files[0] : value}))
    }

    function handleButtonClick(){
        fileInputRef.current.click();
    }
    async function uploadImage(file){ 
        const data = new FormData();
        data.append("file",file);
        data.append("upload_preset", "jfhbuazc");
        data.append("folder","post_images")
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud.cloud_name}/image/upload`,
            {method:"POST", body:data}
        );
        const img = await res.json();
        return {
            secure_url: img.secure_url,
            public_id: img.public_id
        };
    }

    async function handleSubmit(e){
        e.preventDefault();
        setLoading(true)
        const fileData = await uploadImage(editData.image);
        const fetchParams = {method:'PUT', headers:{"Content-Type":"application/json"},
            body:JSON.stringify({message:editData.message, image:{url:fileData.secure_url, id:fileData.public_id}})}

        fetch(`/api/post/find/${id}/update`, fetchParams)
            .then(res => res.json())
            .then(data => data.message === "success" && location.reload())
            .catch(error => console.error(`error updating post ${error}`))
            .finally(() => setLoading(false))
    }

    function handleLike(){
        const id = currentUser._id

        fetch(`/api/post/find/${postData._id}/like`,{method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:id})})
            .then(res => res.json())
            .then(data => data.message === "success" ? setLiked(true) : console.log(data))
            .catch(error => console.error(`error liking message: ${error}`))
        setLiked(true)
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
        setLiked(false)
    }


    const editItems = (
        <div className="dialogBackdrop">
        <form onSubmit={handleSubmit} className={`${style.form} editBoard`}>
        <label htmlFor="message">Message</label>
        <textarea className={`${style.textarea} beautiful-shadow-1`} name="message" value={editData.message} onChange={handleChange}/>
            <div className={style.imageInputHolder} onClick={handleButtonClick}>
            <label htmlFor="image" className={style.imageLabel}><img src="/icons/upload.svg"/>Choose a file</label>
            <input ref={fileInputRef} type="file" name="image" multiple={false} onChange={handleChange} className={style.imageInput}/>
        </div>
        <div className={style.popupButtonHolder}>
        <button className={`${style.popupButtons} beautiful-shadow-1`} 
        onClick={() => setStatus(prevStatus => ({...prevStatus,showEdit:false}))}>Cancel</button>
        <button className={`${style.popupButtons} beautiful-shadow-1`}>Submit</button>
        </div>
        </form>
        </div>
    )

    const deleteItems= (
        <div className="dialogBackdrop">
            <div className="editBoard">
            <p>Are you sure you want to delete? </p>
            <div className={style.popupButtonHolder}>
            <button className={`${style.popupButtons} beautiful-shadow-1`} onClick={() => setStatus(prevStatus => ({...prevStatus,showDelete:false}))}>Cancel</button>
            <button className={`${style.popupButtons} beautiful-shadow-1`} onClick={() => fetch(`/api/post/find/${id}/delete`,{method:"DELETE"})
                .then(res=>res.json()).then(data=> data.message="success" && navigate("/"))}>Delete 
            </button>
        </div>
            </div>
        </div>
    )

    if(loading || isLoading){return <p>Loading... </p>}
    return (
        <div className="content">
        <Navbar/>
        <div className={style.bodyInfo}>
        <div className={style.insideBodyInfo}>
        <div className={style.postData}>
        <h3 className={style.postAuthor}>{postData.author.username}</h3>
        <div className={`${style.postImage} beautiful-shadow-1`}>{postData.image && <img  src={postData.image.url}
            alt="Post Image" className={style.postImage}/>}</div>
        <div className={style.subDetails}>
        <p className={style.timestamp}>{format(postData.createdAt, "do MMMM")}</p>
        <div className={style.likeHolder}>
        <p>{postLikes}</p>
        <button onClick={liked ? handleUnlike :handleLike} className={style.likesimagebutton}>
        <img className={`${style.likesImage} ${liked ? "pulse" :""}`} src={liked ? "/icons/full-heart.png" :"/icons/heart.svg"} alt="likes"/>
        </button>
        </div>
        </div>
        <p className={style.postMessage}>{postData.message}</p>
        </div>
        <div className={style.postButtons}>
        {currentUser._id === postData?.author._id && <button className={style.postEdit} onClick={() => setStatus(prev =>({...prev, showEdit:true}))}>Edit</button>}
        {currentUser._id === postData?.author._id && 
                <button className={style.postDelete} onClick={() => setStatus(prev => ({...prev, showDelete:true}))}>
                <img alt="delete" src="/icons/trash.svg"/></button>}
        </div>
        <hr className={style.seperator}/>
        {status.showDelete && deleteItems}
        {status.showEdit && editItems}
        <DisplayComments postid={postData._id} currentUser={currentUser}/>
        </div>
        </div>
        </div>
    )
}

export default PostDetail
