import React from "react";
import Navbar from "../generalComponents/Navbar";
import { useNavigate, Outlet } from "react-router-dom";
import { useUser } from "../userComponents/UserContext.jsx";
import UserMessages from "./UserMessages";
import style from "../../styling/messageStyles/messagedisplay.module.css";

function MessageHolders() {
    const { currentUser, isLoading } = useUser();
    const [userMessages, setUserMessages] = React.useState([]);
    const [allUsers, setAllUsers] = React.useState();
    const [loading, setLoading] = React.useState(true);
    const [messageOpened, setMessageOpened] = React.useState(false);
    const navigate = useNavigate();
    const [findUsers, setFindUsers] = React.useState(false);

    React.useEffect(() => {
        if (!isLoading) {
            if (!currentUser || currentUser.message === "none") {
                navigate("/login")
            } else {
                callApis();
            }
        }
    }, [currentUser, isLoading, navigate])

    function callApis() {
        currentUser && fetch(`/api/message/find/user/${currentUser._id}`, { credentials: "include" })//set this to user id but need to do useContext first
            .then(res => res.json())
            .then(data => setUserMessages(data))
            .catch(error => console.error(`there was an error fetching messages: ${error}`))

        fetch("/api/user/find", { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setAllUsers(data);
                setLoading(false)
            })
            .catch(err => {
                console.error(`there was an error fetching all users: ${err}`)
                setLoading(false)
            })
    }

    function handlePostClick(id) {
        navigate(`/messages/${id}`)
    }

    function createMessage(id) {
        console.log("creating message")
        const fetchParams = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id }),
            credentials: "include"
        }
        fetch("/api/message/create", fetchParams)
            .then(res => res.json())
            .then(data => data.message === "success" && navigate(`/messages/${data.id}`))
            .catch(error => console.error(`there was an error creating message: ${error}`))
        setFindUsers(false);
    }

    function openMessage(id) {
        navigate(`/messages/${id}`)
    }

    function handleUserClick(id) {
        let messageExists = false;
        let postId;
        for (const message of userMessages) {
            let currentExists = false;
            let otherExists = false;
            for (const user of message.users) {
                if (currentUser._id === user._id) {
                    currentExists = true
                }
                else if (id === user._id) {
                    otherExists = true
                    postId = message._id
                }
            }
            if (currentExists && otherExists) { messageExists = true }
        }
        if (messageExists) {
            openMessage(postId)
        }
        else {
            createMessage(id)
        }
    }

    const usersMapped = allUsers?.map(user => {
        return (
            <div key={user._id} onClick={() => handleUserClick(user._id)}>
                <h3>{user.username}</h3>
            </div>
        )
    })

    const findNewUsers = (
        <div className="dialogBackdrop" >
            <div className="editBoard">
                {usersMapped}
                <button onClick={() => setFindUsers(false)}>Close</button>
            </div>
        </div>
    )


    if (loading) { return <h1>Loading...</h1> }

    return (
        <div className={style.content}>
            <Navbar />
            {userMessages?.length > 0 ? <UserMessages allMessages={userMessages} handleClick={handlePostClick} currentUser={currentUser} /> : <h3>No Messages</h3>}
            <Outlet context={[findUsers, setFindUsers]} />
            {findUsers && findNewUsers}
        </div>
    )
}
//need to check if message is open show message else show the last div

export default MessageHolders
