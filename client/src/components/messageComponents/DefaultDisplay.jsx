import style from "../../styling/messageStyles/messagedisplay.module.css"
import { useOutletContext} from "react-router-dom";

export default function DefaultDisplay(){
    const [findUsers,setFindUsers] = useOutletContext();
    return (
        <div className={style.noMessageOpened}>
            <h4>Your Messages <br /> go here</h4>
            <button className="beautiful-shadow-1" onClick={() => setFindUsers(!findUsers)}>Send Message</button>
        </div>
    )
}
