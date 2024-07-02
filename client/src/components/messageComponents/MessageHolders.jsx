import React from "react";
import Navbar from "../generalComponents/Navbar";
import {useNavigate} from "react-router-dom";
import {useUser} from "../userComponents/UserContext.jsx"

function MessageHolders(){
    const {currentUser,isLoading} = useUser();
    const [userMessages, setUserMessages] = React.useState([]);
    const [allUsers, setAllUsers] = React.useState();
    const [loading, setLoading] = React.useState(true);
    const navigate = useNavigate();

    React.useEffect(()=>{
        currentUser && fetch(`/api/message/find/user/${currentUser._id}`)//set this to user id but need to do useContext first
        .then(res => res.json())
        .then(data => {setUserMessages(data)})
        .catch(error => console.error(`there was an error fetching messages: ${error}`))

        fetch("/api/user/find")
        .then(res=>res.json())
        .then(data => {
            setAllUsers(data);
            setLoading(false)
        })
        .catch(err => {
            console.error(`there was an error fetching all users: ${err}`)
            setLoading(false)
        })
    },[])

    function handlePostClick(id){
        console.log(id)
    }

    function createMessage(id){
        console.log("creating message")
        const fetchParams = {
            method:"PUSH",
            headers:{"Content-Type": "application/json"},
            body:JSON.stringify(id)
        }
        fetch("/api/message/create",fetchParams)
        .then(res => res.json())
        .then(data => data.message === "success" && navigate(`/messages/${data.id}`))
        .catch(error => console.error(`there was an error creating message: ${error}`))
    }

    function openMessage(id){
        navigate(`/messages/${id}`)
    }

    function handleUserClick(id){ //Need to if message doesnt exist between the 2 ids, create message, else open message

        let messageExists =false;
        let postId;
        for(const message of userMessages){
            let currentExists = false;
            let otherExists = false;
            for(const user of message.users){
                console.log(user)
                if(currentUser._id === user){currentExists=true}
                else if(id === user){
                    otherExists=true
                    postId = message._id
                }
            }
            if(currentExists && otherExists){messageExists = true}
        }
        if(messageExists){openMessage(postId)}
        else{
            createMessage(id)
        }
    }

    const usersMapped = allUsers?.map(user => {
        return(
            <div key={user._id} onClick={() => handleUserClick(user._id)}>
                <h3>{user.username}</h3>
            </div>
        )
    })

    /*const messagesMapped = userMessages?.map(message => { //call later after i create a message
        return (<div key={message._id} onClick={() => handlePostClick(message._id)}>
            <h4>Author: {message.author.username} | Recipient: {messagei.recipient.username}</h4>
            <p>{messaage.updatedAt}</p>
        </div>
    )})*/ 

    if(loading){return <h1>Loading...</h1>}

    return (
        <div>
        <Navbar />

        <div>
            {usersMapped}
        </div>
        </div>
    )
}

export default MessageHolders
