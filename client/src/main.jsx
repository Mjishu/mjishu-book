import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import routes from "../routes.jsx"
import {UserProvider} from "./components/userComponents/UserContext.jsx"

const wrappedRoutes = routes.map(route => ({
    ...route,
    element: <UserProvider>{route.element}</UserProvider>
}))

const router = createBrowserRouter(wrappedRoutes)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
    <RouterProvider router={router}/>
    </UserProvider>
  </React.StrictMode>,
)
