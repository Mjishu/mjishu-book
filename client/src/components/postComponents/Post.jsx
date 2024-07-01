import React from "react";

function Post(props){


    return (
        <div>
        <div onClick={() => props.handleClick(props.id)}>
            <h4>{props.author}</h4>
            <p>{props.body}</p>
            <p>{props.time}</p>
        </div>
        </div>
    )
}

export default Post
