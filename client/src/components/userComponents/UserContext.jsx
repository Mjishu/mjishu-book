import React from 'react';

const UserContext = React.createContext();

export function UserProvider({ children }) { //replace useRef with callback
    const [currentUser, setCurrentUser] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const currentUserRef = React.useRef(null)

    React.useEffect(() => {
        fetch("/api/user/current", { method: "GET", credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setCurrentUser(data)
                setIsLoading(false)
            })
            .catch(error => {
                console.error(`error fetching current user: ${error}`)
                setIsLoading(false)
            })
    }, [])

    const memoizedCurrentUser = React.useMemo(() => currentUser, [currentUser]);

    const contextValue = React.useMemo(() => ({
        currentUser: memoizedCurrentUser,
        currentUserRef,
        setCurrentUser: (user) => {
            setCurrentUser(user)
            currentUserRef.current = user;
        }, isLoading
    }), [memoizedCurrentUser, isLoading])

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = React.useContext(UserContext);
    if (context === undefined) {
        throw new Error(`useUser must be withing a userProvider`)
    }
    return context
}
