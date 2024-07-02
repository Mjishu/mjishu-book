import React from "react";
import {format} from "date-fns";
import {useUser} from "../userComponents/UserContext.jsx"

function MessageBody(props){
    const {currentUser} = useUser();
    const [messageBody,setMessageBody] = React.useState({
        message: "",
        author: currentUser._id
    })

    const messagesMapped = props.body.map(message => {
        const todaysDate = new Date();
        const todaysDateSplit = todaysDate.toISOString().split("T")[0];
        const storedDateSplit = message.timestamp.split("T")[0];
        let isCurrentUser;
        let formatedTime;

        //Check hour
        /*if(todaysDateSplit === storedDateSplit){
            formatedTime = `${format(props.time, "h aaa")} sent`
        }else{
           formatedTime = format(props.time, "do MMMM")
        }*/
        //if (message.author.username === loggedInUser.username){
         //   isCurrentUser = true;}

        return (<div key={props.id}>
            <h6>{message.author.username}</h6>
            <p>{message.message}</p>
            <p>{formatedTime}</p>
        </div>)
    })

    function handleChange(e){
        const {name,value} = e.target;
        setMessageBody(prev=>({...prev, [name]:value}))
    }

    function handleSubmit(e){
        e.preventDefault();
        console.log(messageBody)

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
        <div>
        {messagesMapped}
        <form onSubmit={handleSubmit} autoComplete="off">
            <label htmlFor="message">Message</label>
            <input type="text" name="message" onChange={handleChange} value={messageBody.message}/>
            <button>Send</button>
        </form>
        </div>
    )
}

export default MessageBody
