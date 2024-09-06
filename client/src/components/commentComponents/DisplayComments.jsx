import React from "react";
import CreateComment from "./CreateComment.jsx";
import style from "../../styling/postStyles/postDetail.module.css";
import { format } from "date-fns"

//props should be postid and currentUser
export default function DisplayComments(props) {
    const [commentData, setCommentData] = React.useState({});
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        fetch(`/api/comments/find/post/${props.postid}`, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setCommentData(data)
                setLoading(false)
            })
            .catch(error => console.error(`there was an error fetching comments: ${error}`))
    }, [props.postid])

    function handleUserClick(id) {
        console.log(`author id: ${id}`)
    }

    function handleDelete(id, authorid) {
        const fetchParams = {
            method: 'DELETE',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: authorid }),
            credentials: "include"
        }
        fetch(`/api/comments/find/${id}/delete`, fetchParams)
            .then(res => res.json())
            .then(data => data.message === "success" ? location.reload() : console.log(data))
            .catch(err => console.log(`error trying to delete comment: ${err}`))
    }

    if (loading) { return <p>Loading...</p> }

    const commentsMapped = commentData.length > 0 && commentData?.map(comment => {
        return (
            <div key={comment._id} className={style.commentHolder}>
                <div className={style.commentMeta}>
                    <h6 onClick={() => handleUserClick(comment.author._id)}>{comment?.author.username}</h6>
                    <p className={style.commentTime}>{format(comment.createdAt, "do MMMM")}</p>
                </div>
                <div className={style.commentBody}>
                    <p>{comment.message}</p>
                    {props.currentUser._id === comment.author._id &&
                        <button className={style.commentDelete} onClick={() => handleDelete(comment._id, comment.author._id)}>
                            <img alt="delete" src="/icons/trash.svg" />
                        </button>}
                </div>
            </div>
        )
    })
    return (
        <div>
            <h5 className={style.commentTitle}>Comments</h5>
            {commentsMapped}
            <CreateComment postid={props.postid} currentUser={props.currentUser} />
        </div>
    )

}
