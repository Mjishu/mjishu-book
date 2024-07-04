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

    function handleDelete(id,authorid){
        const fetchParams={
            method:'DELETE',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({id:authorid})
        }
        fetch(`/api/comments/find/${id}/delete`,fetchParams)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(`error trying to delete comment: ${err}`))
    }

    if(loading){return <p>Loading...</p>}

    const commentsMapped = commentData.length > 0 && commentData?.map(comment => {
        return (
            <div key={comment._id}>
                <p>{comment.message}</p>
                <h6 onClick={()=>handleUserClick(comment.author._id)}>{comment?.author.username}</h6>
                <p>{comment.createdAt}</p>
            {props.currentUser._id === comment.author._id && <button onClick={() => handleDelete(comment._id,comment.author._id)}>Del</button>}
            </div>
        )
    })
    return(
        <div>
        <h5>Comments</h5>
        {commentsMapped}
        <CreateComment postid={props.postid} currentUser={props.currentUser}/>
        </div>
    )

}
