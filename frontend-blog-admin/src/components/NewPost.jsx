import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function NewPost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [postBody, setPostBody] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { token } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        //maybe some frontend validation

        try {
            const response = await fetch(`${API_BASE_URL}/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                },
                body: JSON.stringify({
                    title,
                    postBody,
                }),

            });

            let data = null;
            try {
                data = await response.json();
            } catch {
                data = null;
            }
            console.log("data: ", data)

            if (!response.ok) {
                console.log("error: ", data.error)
                setErrorMessage(data?.error ?? `failed to create post (${response.status})`);
                return;
            }
            navigate("/")// will edit to go to /data.post.id once I create a page for individual posts

        } catch (err) {
            console.error(err);
        }
    }
    return (
        <div>
            <h1>Create a new Blog post</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title: </label>
                <input
                    id="title"
                    type="text"
                    name="title"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value); setErrorMessage("");
                    }} required
                />

                <label htmlFor="postBody">Body: </label>
                <input
                    id="postBody"
                    type="text"
                    name="postBody"
                    value={postBody}
                    onChange={(e) => {
                        setPostBody(e.target.value); setErrorMessage("");
                    }} required
                />
                {errorMessage && <p role="alert">{errorMessage}</p>}
                <button type="submit">Create Post</button> <span>You will get the chance to review the post before publishing to public</span>
                {/* should redirect to this specific post page after submission, for review. which means I will probably create a spearate page for postId for admin vs user */}
            </form>
        </div>
    );
}