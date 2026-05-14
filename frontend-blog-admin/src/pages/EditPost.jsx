import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSecureFetch } from "../hooks/useSecureFetch";
import { Editor } from '@tinymce/tinymce-react';
import DOMPurify from 'dompurify';




const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditPost() {
    const editorRef = useRef(null);
    const navigate = useNavigate();
    const { token } = useAuth();
    const { postId } = useParams();
    const id = Number(postId);
    const idIsValid = Number.isFinite(id) && id > 0;

    // const [post, setPost] = useState(null);
    const [title, setTitle] = useState("");
    const [postBody, setPostBody] = useState("");
    const [loading, setLoading] = useState(true);

    // const [comments, setComments] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const secureFetch = useSecureFetch();

    useEffect(() => {
        if (!idIsValid) return;
        let cancelled = false;
        async function loadPost() {
            try {
                setErrorMessage("");
                setLoading(true);
                const response = await secureFetch(`${API_BASE_URL}/admin/posts/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch post");
                };
                const data = await response.json();
                console.log(data.post);
                if (cancelled) return;
                setTitle(data.post.title ?? "");
                setPostBody(data.post.body ?? "");
                console.log("data: ", data)
            } catch (err) {
                console.error(err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        loadPost();
        return () => {
            cancelled = true;  // stops before setPost if page about to be changed or component loads again
        };
    }, [secureFetch, id, idIsValid]);

    async function handleSubmit(e) {
        e.preventDefault();
        //maybe some frontend validation
        setErrorMessage("");

        const html =
            editorRef.current?.getContent({ format: "html" });
        const textOnly =
            editorRef.current?.getContent({ format: "text" })?.trim() ?? "";
        if (!textOnly) {
            setErrorMessage("Body cannot be empty.");
            return;
        }

        try {
            const response = await secureFetch(`${API_BASE_URL}/admin/posts/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                },
                body: JSON.stringify({ title, postBody: html }),
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
            navigate(`/admin/posts/${id}`, { replace: true })
        } catch (err) {
            console.error(err);
            setErrorMessage("Could not reach the server");
        }
    }

    if (!idIsValid) {
        return <div>Please input a valid id</div>;
    }
    if (loading) return <p>Loading…</p>;

    return (
        <div>
            <h1>Edit Post</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <label htmlFor="postBody">Body</label>
                <Editor
                    key={id}
                    id="postBody"
                    textareaName="postBody"
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    onInit={(_e, editor) => {
                        editorRef.current = editor;
                    }}
                    // onEditorChange={(content) => setPostBody(content)}
                    initialValue={postBody}
                    init={{
                        height: 400,
                        menubar: false,
                        toolbar:
                            "undo redo | blocks | bold italic | bullist numlist | link | removeformat | code",
                    }}
                />
                {errorMessage && <p role="alert">{errorMessage}</p>}
                <button type="submit">Save changes</button>
            </form>
        </div>
    )
}