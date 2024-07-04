import React from "react";

//props needs postid
export default function CreateComment(props){
    const [commentDetails,setCommentDetails] = React.useState({
        message:"",
    });

    function handleSubmit(e){
        e.preventDefault();

        const fetchParams ={
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({message:commentDetails.message,id:props.currentUser._id})
        }
        fetch(`/api/comments/create/${props.postid}`,fetchParams)
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(error => console.error(`error creating message: ${error}`))

        setCommentDetails(prev=>({...prev,message:""}))
    }
    function clearInput(){
        setCommentDetails({message:"",})
    }

    function handleChange(e){
        const {name,value} = e.target;
        setCommentDetails(prev=>({...prev,[name]:value}))
    }

    return(
        <form onSubmit={handleSubmit} autoComplete="off">
            <label htmlFor="message">Comment</label>
            <input type="text" onChange={handleChange} value={commentDetails.message} name="message"/>
            <button onClick={clearInput}>Clear</button>
            <button>Submit</button>
        </form>
    )
}
