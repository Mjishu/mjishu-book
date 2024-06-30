import {Link} from "react-router-dom"

function Error(){
    return (
        <div>
            <h1> Error fetching page</h1>
            <Link to="/">Home</Link>
        </div>
    )
}

export default Error
