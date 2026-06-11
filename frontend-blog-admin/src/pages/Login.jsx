import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
// import { useEffect } from "react";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const fromPath = location.state?.from?.pathname || "/admin";
    // useEffect(() => {
    //     console.log("location.state:", location.state);
    // }, [location]);

    async function handleSubmit(e) {
        e.preventDefault();
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
        //maybe some frontend validation
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),

            })
            let data = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }
            if (!response.ok) {
                console.log("error: ", data.error)
                setErrorMessage(data.error ?? "test error logging in");
                return;
            }
            login(data.token, data.user);
            toast.success("Logged in successfully");
            // navigate("/", {
            //     state: { message: "Log in successful" },
            // });
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
            <h1>Admin Login</h1>
            <p>Login form:</p>
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
                <button type="submit">Log in</button>
            </form>
        </div>
    )
}