import React from "react";
import Navbar from "../generalComponents/Navbar";
import style from "../../styling/postStyles/postCreate.module.css";
import {useNavigate} from "react-router-dom";
import {useUser} from "../userComponents/UserContext.jsx"

function CreatePost(){
    const [postData,setPostData] = React.useState({
        message:"",
        image: "", 
    });
    const [cloud,setCloud] = React.useState()
    const navigate = useNavigate()
    const fileInputRef = React.useRef(null)
    const {currentUser} = useUser();

    React.useEffect(()=>{
        fetch("/api/uploadForm")
        .then(res=>res.json())
        .then(data => setCloud(data)).catch(err =>console.error(err))
    },[])

    function handleChange(e){
        const {name,value,files,type} = e.target;
        setPostData(prevData => ({
            ...prevData,
            [name]: type==="file" ? files[0] : value
        }))
    };

    async function uploadImage(file){ 
        const data = new FormData();
        data.append("file",file);
        data.append("upload_preset", "jfhbuazc");
        data.append("folder","post_images")
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud.cloud_name}/image/upload`,
            {method:"POST", body:data}
        );
        const img = await res.json();
        return {
            secure_url: img.secure_url,
            public_id: img.public_id
        };
    }
    

    async function handleSubmit(e){
        e.preventDefault();
        const imageData = await uploadImage(postData.image)
        const fetchParams ={
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({message:postData.message, image:{url:imageData.secure_url,id:imageData.public_id}})
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
            <input ref={fileInputRef} type="file" name="image" multiple={false} onChange={handleChange} className={style.imageInput}/>
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
