import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css"
import AdminSwapButton from "./AdminSwapButton";

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <h2>Blog Reader</h2>
            <ul>
                <li><NavLink to="/" className={({ isActive }) => isActive ? styles.active : ""} >Home Page</NavLink></li>
                {user ?
                    (
                        <>
                            <li><span className="welcome-text">Hi, {user.username}</span></li>
                            {/* <li><NavLink to="/admin/newPost" className={({ isActive }) => (isActive ? styles.active : "")}>Create new Post +</NavLink></li> */}
                            <li><button onClick={logout} className="logout-btn">Logout</button></li>
                            <AdminSwapButton/>
                        </>

                    ) : (
                        <>
                            <li><NavLink to="/login" className={({ isActive }) => (isActive ? styles.active : "")}>Login</NavLink></li>
                            <li><NavLink to="/register" className={({ isActive }) => (isActive ? styles.active : "")}>Register</NavLink></li>
                        </>
                    )
                }
            </ul>
        </nav>
    )
}