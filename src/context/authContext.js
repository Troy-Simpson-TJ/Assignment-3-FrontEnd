import {createContext, useContext, useState, useEffect} from "react";

const authContext = createContext(null);

export function AuthProvider({children}){
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if(savedUser){
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (user, token) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return(
        <authContext.Provider value={{user, login, logout}}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth(){
    return useContext(authContext);
}