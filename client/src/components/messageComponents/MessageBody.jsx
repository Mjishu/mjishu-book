import React from "react";
import {format} from "date-fns";
import {useUser} from "../userComponents/UserContext.jsx";
import style from "../../styling/messageStyles/messagedisplay.module.css"

function MessageBody(props){
    const {currentUser} = useUser();
    const [messageBody,setMessageBody] = React.useState({
        message: "",
        author: currentUser._id
    })
    const chatContainerRef= React.useRef(null);

    React.useEffect(()=>{
        const chatContainer = chatContainerRef.current;
        if(chatContainer){
            chatContainer.scrollTop = chatContainer.scrollHeight
        }
    },[messageBody])

    const messagesMapped = props.body.map(message => {
        const messageDate = message.timestamp
        const todaysDate = new Date().toISOString();
        const todaysDateSplit = todaysDate.split("T")[0];
        const storedDateSplit = messageDate.split("T")[0];
        let isCurrentUser;
        let formatedTime;

        //Check hour
        if(todaysDateSplit === storedDateSplit){
            formatedTime = `${format(message.timestamp, "h aaa")} sent`
        }else{
            formatedTime = format(message.timestamp, "do MMMM")
        }
            if (message.author.username === currentUser.username){
                isCurrentUser = true;}

        return (<div key={message._id} className={style.messagesMapped}>
            <h6 className={style.messageAuthor}>{message.author.username}</h6>
            <p className={style.messageBody}>{message.message}</p>
            <p className={style.messageTime}>{formatedTime}</p>
            </div>)
    })

    function handleChange(e){
        const {name,value} = e.target;
        setMessageBody(prev=>({...prev, [name]:value}))
    }

    function handleSubmit(e){
        e.preventDefault();

        const fetchParams = {method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(messageBody)
        }
        fetch(`/api/message/find/${props.id}/update`,fetchParams) //isnt making api call
            .then(res=>res.json())
            .then(data => console.log(data))
            .catch(err => console.error(`error sending message: ${err}`))

        setMessageBody(prev=>({...prev,message:""}))
    }

    return (
        <div className={style.messageBody}>
        <div className={style.messageParts} ref={chatContainerRef}>
        {messagesMapped}
        </div>
        <form onSubmit={handleSubmit} autoComplete="off" className={style.messageInput}>
        <input type="text" name="message" onChange={handleChange} value={messageBody.message} 
        className="beautiful-shadow-1"/>
        <button className={`beautiful-shadow-1`}>
        <img src="/icons/paper-plane.svg" alt="Send"/>
        </button>
        </form> 
        </div>
    )
}

export default MessageBody
