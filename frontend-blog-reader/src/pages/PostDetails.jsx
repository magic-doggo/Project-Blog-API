import { useCallback, useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { useSecureFetch } from "../hooks/useSecureFetch";
import DOMPurify from 'dompurify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PostDetails() {
    // const navigate = useNavigate();
    // const { token } = useAuth();
    const { postId } = useParams();
    const id = Number(postId);
    const idIsValid = Number.isFinite(id) && id > 0;

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentBody, setCommentBody] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const secureFetch = useSecureFetch();

    const loadComments = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/posts/${id}/comments`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            };
            const data = await response.json();
            console.log("data.comments: ", data.comments);
            // if (cancelled) return;
            setComments(data.comments ?? []);
            console.log("data: ", data)
        } catch (err) {
            console.error(err);
        }
    }, [id]);

    useEffect(() => {
        if (!idIsValid) return;
        let cancelled = false;
        async function loadPost() {
            try {
                const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
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
                setPost(data.post ?? null);
                console.log("data: ", data)
            } catch (err) {
                console.error(err);
            }
        }
        loadPost();
        loadComments();

        return () => {
            cancelled = true;  // stops before setPost if page about to be changed or component loads again
        };
    }, [id, idIsValid, loadComments]);

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMessage("");
        //maybe some frontend validation
        const trimmed = commentBody.trim();
        if (!trimmed) {
            setErrorMessage("Comment cannot be empty.");
            return;
        }
        try {
            const response = await secureFetch(`${API_BASE_URL}/posts/${id}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ commentBody: trimmed }),
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

            setCommentBody("");
            setErrorMessage("");
            // setComments((prev) => [...prev, data.comment]);
            await loadComments();
        } catch (err) {
            console.error(err);
        }
    }

    if (!idIsValid) {
        return <div>Please input a valid id</div>;
    }
    if (!post) return <p>Loading…</p>;

    return (
        <div>
            <h2>Post Details:</h2>
            <h3>Title: {post.title}</h3>
            <p>Post Body:</p>
            <div
                className="post-body"
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.body ?? ""),
                }}
            />
            <p>Author: {post.author?.username ?? "deleted user"}</p>

            <p>Leave a comment for <strong>"{post.title}"</strong>:</p>
            {errorMessage && <p role="alert">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="commentBody">Comment: </label>
                <input
                    id="commentBody"
                    type="text"
                    name="commentBody"
                    value={commentBody}
                    onChange={(e) => {
                        setCommentBody(e.target.value); setErrorMessage("");
                    }} required
                />
                <button type="submit">Submit comment</button>
            </form>
            <p>Nr of comments: {comments.length}</p>
            <p>Comments:</p>
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <div>{comment.body}</div>
                        <div>{comment.author.username} - {comment.updatedAt ?? comment.publishedDate}</div>
                    </li>
                ))}
            </ul>
        </div>
    )
}