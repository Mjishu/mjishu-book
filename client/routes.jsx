import App from "./src/App";
import Error from "./src/components/generalComponents/Error"
import LogIn from "./src/components/userComponents/log-in"
import Signup from "./src/components/userComponents/sign-up"

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
    }

]

export default routes
