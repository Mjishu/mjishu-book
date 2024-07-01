import React from "react"
import {Link,useNavigate} from "react-router-dom";

function User(){
    return(
        <div>
        <Link to="/login">Log in</Link>
        <Link to="/sign-up">Sign up</Link>
        </div>
    )
}
export default User
