import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext";


export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        //maybe some frontend validation
        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
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

            // console.log("data: ", data) // token + user.id,username,email,role
            if (!response.ok) {
                console.log("error: ", data.error)
                setErrorMessage(data.error ?? "test error logging in");
                return;
            }
            login(data.token, data.user)
            navigate("/", {
                state: { message: "Log in successful" },
            });

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