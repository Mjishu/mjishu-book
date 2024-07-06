import App from "./src/App";
import Error from "./src/components/generalComponents/Error";
import LogIn from "./src/components/userComponents/log-in";
import Signup from "./src/components/userComponents/sign-up";
import User from "./src/components/generalComponents/User";
import CreatePost from "./src/components/postComponents/createPost";
import PostDetail from "./src/components/postComponents/postDetail";
import Profile from "./src/components/userComponents/Profile";
import MessageHolders from "./src/components/messageComponents/MessageHolders";
import MessageId from "./src/components/messageComponents/MessageId"; 
import DefaultDisplay from "./src/components/messageComponents/DefaultDisplay"

const routes = [
    {
        path: "/",
        element: <App/>,
        errorElement:<Error/>
    },
    {
        path:"/login",
        element:<LogIn/>
    },
    {
        path:"/sign-up",
        element:<Signup/>
    },
    {
        path:"/post/create",
        element:<CreatePost/>
    },
    {
        path:"/post/:id",
        element:<PostDetail/>
    },{
        path:"/profile/:id",
        element: <Profile/>
    },
    {
        path:"/messages",
        element:<MessageHolders/>,
        children:[
            {index:true, element: <DefaultDisplay/>},
            {path:":id", element: <MessageId/>}
        ]
    },

]

export default routes
