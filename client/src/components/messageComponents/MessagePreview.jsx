import style from "../../styling/messageStyles/messagedisplay.module.css"

// image, username , body, timestamp
export default function MessagePreview(props){
    return (
        <div className={style.messagePreviewHolder} onClick={() => props.handleClick(props.id)}>
        {props.image ? <img className={style.pfp} src={props.image} alt="profile picture"/> : <div className={style.imagePlaceholder}></div>}
        <div className={style.previewTextDetails}>
        <h5>{props.username}</h5>
        <p>{props.body}</p>
        </div>
        <p className={style.messagePreviewTimestamp}>{props.timestamp}</p>
        </div>
    )
}
