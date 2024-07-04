import React from "react";
import CreateComment from "./CreateComment.jsx"

//props should be postid and currentUser
export default function DisplayComments(props){
    const [commentData,setCommentData] = React.useState({});
    const [loading, setLoading] = React.useState(true)

    React.useEffect(()=>{
        fetch(`/api/comments/find/post/${props.postid}`)
        .then(res => res.json())
        .then(data => {
            setCommentData(data)
            setLoading(false)
        })
        .catch(error => console.error(`there was an error fetching comments: ${error}`))
    },[props.postid])

    function handleUserClick(id){
        console.log(`author id: ${id}`)
    }

    function handleDelete(id){
        console.log(`comment id: ${id}`)
    }

    if(loading){return <p>Loading...</p>}

    const commentsMapped = commentData.length > 0 && commentData?.map(comment => {
        return (
            <div>
                <p>{comment.message}</p>
                <h6 onClick={()=>handleUserClick(comment.author._id)}>{comment?.author.username}</h6>
                <p>{comment.createdAt}</p>
            {props.currentUser._id === comment.author._id && <button onClick={() => handleDelete(comment._id)}>Del</button>}
            </div>
        )
    })
    return(
        <div>
        {commentsMapped}
        <CreateComment postid={props.postid} currentUser={props.currentUser}/>
        </div>
    )

}
