import React from "react";

function MessageId(){
    const [messageData,setMessageData] = React.useState();
    const [loading,setLoading] = React.useState(true);

    const id = window.location.href.split("/")[window.location.href.split("/") - 1]

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

    return(
        <div>
        <h4>Author: {messageData?.author.username} | Reciever: {messageData?.recipient.username}</h4>

        </div>
    )
}

export default MessageId
