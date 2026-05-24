import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

export default function Register() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const fromPath = location.state?.from ?? "/";
    // useEffect(() => {
    //     console.log("location.state:", location.state);
    // }, [location]);

    async function handleSubmit(e) {
        e.preventDefault();
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        //maybe some frontend validation
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    username,
                    password,
                }),

            })
            // console.log("response:", response); //status, type: cors, url

            let data = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }

            if (!response.ok) {
                console.log("error: ", data.error)
                setErrorMessage(data.error ?? "test error registering");
                return;
            }
            login(data.token, data.user);
            toast.success("Registered successfully");
            navigate(fromPath,
                {
                    replace: true,
                }) //fromPath sends user to page they were trying to access before, if they were redirected to login. replace makes it so pressing back does not go back to login form, but to page even before

        } catch (err) {
            console.error(err)
        }
    }
    return (
        <div>
            <h1>User Register</h1>
            <p>Register form:</p>
            <form onSubmit={handleSubmit} >
                <label htmlFor="email">Email: </label>
                <input
                    id="email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value); setErrorMessage("");
                    }} required
                />
                <label htmlFor="username">Username: </label>
                <input
                    id="username"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value); setErrorMessage("");
                    }} required
                />

                <label htmlFor="password">Password </label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value); setErrorMessage("");
                    }} required
                />
                {errorMessage && <p role="alert">{errorMessage}</p>}
                <button type="submit">Register</button>
            </form>

            <p>Already have an account? <Link to="/login">Log in</Link></p>
        </div>
    )
}