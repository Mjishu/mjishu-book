import React from 'react';

const UserContext = React.createContext();

export function UserProvider({children}){
    const[currentUser,setCurrentUser] = React.useState(null);
    const [isLoading,setIsLoading] = React.useState(true);

    React.useEffect(()=>{
        fetch("/api/user/current")
            .then(res=>res.json())
            .then(data => {
                setCurrentUser(data)
                setIsLoading(false)
            })
            .catch(error => {
                console.error(`error fetching current user: ${error}`)
                setIsLoading(false)
            })
    },[])

    return (
        <UserContext.Provider value={{currentUser,setCurrentUser, isLoading}}>
        {children}
        </UserContext.Provider>
    )
}

export function useUser(){
    const context = React.useContext(UserContext);
    if(context===undefined){
        throw new Error(`useUser must be withing a userProvider`)
    }
    return context
}
