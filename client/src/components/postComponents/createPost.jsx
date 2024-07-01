import React from "react";
import Navbar from "../generalComponents/Navbar"
import style from "../../styling/postStyles/postCreate.module.css"
import {useNavigate} from "react-router-dom"

function CreatePost(){
    const [postData,setPostData] = React.useState({
        message:"",
        image: "", //Not yet
    });
    const [currentUser,setCurrentUser] = React.useState();
    const navigate = useNavigate()

    React.useEffect(()=>{
        fetch("/api/user/current")
        .then(res=>res.json()).then(data => setCurrentUser(data))
        .catch(err => console.error(`error fetching user ${err}`))
    },[])

    function handleChange(e){
        const {name,value} = e.target;
        setPostData(prevData => ({
            ...prevData,
            [name]:value
        }))
    };

    function handleSubmit(e){
        e.preventDefault();
        const fetchParams ={
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(postData)
        }
        fetch('/api/post/create', fetchParams)
        .then(res=>res.json()).then(data=> data.message ==="success" && navigate("/"))
        .catch(err => console.error(err))
    }

    return(
        <div>
        <Navbar/>
        <form autoComplete="off" onSubmit={handleSubmit} className={style.form}>
            <label htmlFor="message">Message</label>
            <textarea type="text" name="message" onChange={handleChange} value={postData.message} className={style.messageInput}/>
            <button className={style.postButton}>Submit</button>
        </form>
        </div>
    )
}

export default CreatePost
