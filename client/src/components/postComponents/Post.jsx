import React from "react";
import style from "../../styling/generalStyles/home.module.css"

function Post(props){ //add likes to here
    const [liked,setLiked] = React.useState(props.likes.some(like => like._id === props.currentUser._id));

    React.useEffect(()=>{
        console.log(liked)
        console.log("likes are",props.likes)
        console.log(props.currentUser._id)
    },[liked])

    function handleLike(){
        const id = props.currentUser._id
    
        console.log("liking")
        fetch(`/api/post/find/${props.id}/like`,{method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({id:id})})
        .then(res => res.json())
        .then(data => data.message === "success" ? setLiked(true) : console.log(data))
        .catch(error => console.error(`error liking message: ${error}`))
    }

    function handleUnlike(){
        const id = props.currentUser._id
        console.log("unliking")
        fetch(`/api/post/find/${props.id}/unlike`, {method:'POST',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({id:id})
        })
        .then(res => res.json())
        .then(data => data.message === "success" ? setLiked(false) :console.log(data))
        .catch(error => console.error(`there was an error unliking the post: ${error}`))
    }

    return (
        <div>
        <div onClick={() => props.handleClick(props.id)}>
            <h4>{props.author}</h4>
            {props.image && <img src={props.image} alt="post image"/>}
            <p>{props.body}</p>
            <p>{props.time}</p>
        </div>
        <div className={style.postLikes}>
        <p>{props.likes.length}</p>
        <button onClick={liked ? handleUnlike :handleLike} className={style.likesImageButton}>
        <img className={style.likesImage} src={liked ? "/icons/full-heart.png" :"/icons/heart.svg"} alt="like"/>
        </button>
        </div>
        </div>
    )
}

export default Post
