import React from "react";
import Navbar from "../generalComponents/Navbar";
import style from "../../styling/postStyles/postCreate.module.css";
import {useNavigate} from "react-router-dom";
import {useUser} from "../userComponents/UserContext.jsx"

function CreatePost(){
    const [postData,setPostData] = React.useState({
        message:"",
        image: "", //Not yet
    });
    const navigate = useNavigate()
    const fileInputRef = React.useRef(null)
    const {currentUser} = useUser();

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
    function handleButtonClick(){
        fileInputRef.current.click();
    }

    return(
        <div className="content">
        <Navbar/>
        <div className={style.body}>
        <form autoComplete="off" onSubmit={handleSubmit} className={style.form}>
        <h2>Create Post</h2>
        <div className={style.formInputs}>
            <label htmlFor="message">Message</label>
            <textarea type="text" name="message" onChange={handleChange} value={postData.message} className={style.messageInput}/>
        <div className={style.buttons}>
            <div className={style.imageInputHolder} onClick={handleButtonClick}>
            <label htmlFor="image" className={style.imageLabel}><img src="/icons/upload.svg"/>Choose a file</label>
            <input ref={fileInputRef}type="file" name="image" onChange={handleChange} value={postData.image} className={style.imageInput}/>
        </div>
        <button className={style.postButton}>Submit</button>
        </div>
        </div>
        </form>
        </div>
        </div>
    )
}

export default CreatePost
