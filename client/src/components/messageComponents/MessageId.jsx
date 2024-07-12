import React from "react";
import MessageBody from "./MessageBody";
import Navbar from "../generalComponents/Navbar";
import {useNavigate} from "react-router-dom";
import UserMessages from "./UserMessages";
import style from "../../styling/messageStyles/messagedisplay.module.css";
import useWebSocket from "react-use-websocket";
import {useUser} from "../userComponents/UserContext.jsx";

//for prod replace WS_URL
function MessageId(){
    const [messageData,setMessageData] = React.useState();
    const [loading,setLoading] = React.useState(true);
    const [deleteMessage,setDeleteMessage] = React.useState(false);
    const navigate = useNavigate();
    const {currentUser,isLoading} = useUser();

    const id = window.location.href.split("/")[window.location.href.split("/").length - 1]

    const WS_URL = "ws://localhost:3000/api/message/current-updates"
    const {sendJsonMessage,lastJsonMessage,readyState} = useWebSocket(WS_URL,{
        queryParams:{username:currentUser?.username, messageid:messageData?._id},share:true,
        onOpen:() => console.log("WebSocket connection opened"),
        shouldReconnect: (closeEvent) => true,
    });

    React.useEffect(()=>{
        if (readyState === WebSocket.OPEN && id){
            sendJsonMessage({messageid:id});
        }
    },[readyState,id,sendJsonMessage]);

    React.useEffect(() => {
        if(lastJsonMessage && lastJsonMessage.messageData._id === id){
            setMessageData(lastJsonMessage.messageData);
            setLoading(false);
        }
    },[lastJsonMessage]);

    React.useEffect(() => {!loading && console.log(`messageData is `,messageData)},[messageData])

    //useEffect that does the WS send everytime submit button is pressed? add a useState to it ? this

    if(loading){return <p>Loading...</p>}


    function handleDeleteSubmit(e){ //not making api call?
        e.preventDefault()

        fetch(`/api/message/find/${id}/delete`,{method:"DELETE", headers:{"Content-Type":"application/json"}})
        .then(res => res.json())
        .then(data => data.message === "success" ? navigate("/messages") : console.log(data))
        .catch(error => console.error(`there was an error trying to delete message: $(error)`))

        setDeleteMessage(false)
    }

    const deleteMessagePopup = (
        <div>
        <form onSubmit={handleDeleteSubmit}>
            <p>Are you sure you want to delete?</p>
            <button onClick={() => setDeleteMessage(false)}>Cancel</button>
            <button >Delete</button>
        </form>
        </div>
    )

    return(
        <div>
        <MessageBody body={messageData.body} id={messageData._id}/>
            <button onClick={() => setDeleteMessage(true)}>Delete</button>
            {deleteMessage && deleteMessagePopup}
        </div>
    )
}

export default MessageId
