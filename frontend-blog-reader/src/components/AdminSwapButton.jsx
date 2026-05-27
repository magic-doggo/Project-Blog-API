import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminSwapButton() {
    const {user} = useAuth();
    const location = useLocation();
    const adminBaseUrl = import.meta.env.VITE_ADMIN_SITE_URL;
    const targetURL = `${adminBaseUrl}${location.pathname}`;
    if (!user || user.role!== "ADMIN") return null;
    return(
        <a href={targetURL}>
            Open page in admin dashboard
        </a>
    )
}