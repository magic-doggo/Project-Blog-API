import { useState, useContext, createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || null));
    console.log("THE PROVIDER IS RETAINING CLOUD DATA!")
    const login = (jwtToken, userData) => {
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", JSON.stringify(userData))
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token")
        localStorage.removeItem("user")
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    // return useContext(AuthContext);
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context;
}