import React from "react";
import MessageBody from "./MessageBody";
import Navbar from "../generalComponents/Navbar"

function MessageId(){
    const [messageData,setMessageData] = React.useState();
    const [loading,setLoading] = React.useState(true);
    const [deleteMessage,setDeleteMessage] = React.useState(false) 

    const id = window.location.href.split("/")[window.location.href.split("/").length - 1]

    React.useEffect(()=>{
        fetch(`/api/message/find/${id}`)
        .then(res=> res.json())
        .then(data => {
            setMessageData(data);
            setLoading(false)
        })
        .catch(error => console.error(`there was an error fetching message: ${error}`))
    },[])

    if(loading){return <p>Loading...</p>}

    const usersMapped = messageData?.users?.map(user => {
        return <div key={user._id}>
            <h5>{user.username}</h5>
            </div>
    })

    function handleDeleteSubmit(e){
        e.preventDefault()
        console.log("deleting")
    }

    const deleteMessagePopup = (
        <div>
        <form onSubmit={handleDeleteSubmit}>
            <p>Are you sure you want to delete?</p>
            <button onClick={() => setDeleteMessage(false)}>Cancel</button>
            <button>Delete</button>
        </form>
        </div>
    )

    return(
        <div>
        <Navbar/>
            {usersMapped}
            <MessageBody body={messageData.body} id={messageData._id}/> 
            <button onClick={() => setDeleteMessage(true)}>Delete</button>
            {deleteMessage && deleteMessagePopup}
        </div>
    )
}

export default MessageId
