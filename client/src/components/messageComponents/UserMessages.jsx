import React from "react";
import MessagePreview from "./MessagePreview";
import style from "../../styling/messageStyles/messagedisplay.module.css";
import {format} from "date-fns";

//allMessages currentUser, handleClick?
export default function UserMessages(props){
    
    const allMessagesMapped = props.allMessages && props.allMessages.map(message => {
        const username = message.users.filter(userId => userId !== props.currentUser._id)
        const formatDate = format(message.updatedAt, "do MMMM")

        return (
            <MessagePreview timestamp={formatDate} 
            username={username[0].username}
            body={message.body.length > 0 ?message.body[message.body.length - 1].message : ""}
            handleClick={props.handleClick} key={message._id} id={message._id}
            />
        )
    })

    return(
        <div className={style.userMessagesHolder}>
        <h2>{props.currentUser.username}</h2>
        <h4> Messages </h4>
        <div className={style.messagesMappedHolder}>
        {allMessagesMapped}
        </div>
        </div>
    )
}
