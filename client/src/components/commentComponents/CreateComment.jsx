import React from "react";
import style from "../../styling/postStyles/postDetail.module.css";

//props needs postid
export default function CreateComment(props) {
    const [commentDetails, setCommentDetails] = React.useState({
        message: "",
    });

    function handleSubmit(e) {
        e.preventDefault();

        const fetchParams = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: commentDetails.message, id: props.currentUser._id }),
            credentials: "include"
        }
        fetch(`/api/comments/create/${props.postid}`, fetchParams)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.error(`error creating message: ${error}`))

        setCommentDetails(prev => ({ ...prev, message: "" }))
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setCommentDetails(prev => ({ ...prev, [name]: value }))
    }

    return (
        <form onSubmit={handleSubmit} autoComplete="off" className={style.commentForm}>
            <input type="text" placeholder="Comment" className={`${style.commentInput} beautiful-shadow-1`} onChange={handleChange} value={commentDetails.message} name="message" />
            <button className={`${style.sendButton} beautiful-shadow-1`}><img alt="submit" src="/icons/paper-plane.svg" /></button>
        </form>
    )
}
