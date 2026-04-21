import { useState, useContext, createContext } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

function readStoredUser() {
    const raw = localStorage.getItem("user");
    if (raw == null || raw === "") {
        return null
    }
    try {
        return JSON.parse(raw);
    } catch {
        localStorage.removeItem("user"); //clear bad data
        return null;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(() => readStoredUser()); //lazy state initialization. only runs once during initial render
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
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within AuthProvider")
    }
    return context;
}