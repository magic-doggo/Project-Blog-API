import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css"

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <h2>Blog admin</h2>
            <ul>
                {/* at some point when regular user page is ready, only show login page for not logged in users on admin page, as well as a link to regular user/public page*/}
                <li><NavLink to="/admin" className={({ isActive }) => isActive ? styles.active : ""} >Dashboard</NavLink></li> 
                {user ?
                    (
                        <>
                            <li><span className="welcome-text">Hi, {user.username}</span></li>
                            <li><NavLink to="/admin/newPost" className={({ isActive }) => (isActive ? styles.active : "")}>Create new Post +</NavLink></li>
                            <li><button onClick={logout} className="logout-btn">Logout</button></li>
                        </>

                    ) : (
                        <li>
                            <NavLink to="/admin/login" className={({ isActive }) => (isActive ? styles.active : "")}>Login</NavLink>
                        </li>
                    )
                }
            </ul>
        </nav>
    )
}