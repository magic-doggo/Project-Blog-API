import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useSecureFetch } from "../hooks/useSecureFetch";
import DOMPurify from 'dompurify';
import EditPost from "./EditPost";




const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function PostDetails() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { postId } = useParams();
    const id = Number(postId);
    const idIsValid = Number.isFinite(id) && id > 0;

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const secureFetch = useSecureFetch();

    useEffect(() => {
        if (!idIsValid) return;
        let cancelled = false;
        async function loadPost() {
            try {
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
                setPost(data.post ?? null);
                console.log("data: ", data)
            } catch (err) {
                console.error(err);
            }
        }
        loadPost();

        async function loadComments() {
            try {
                const response = await secureFetch(`${API_BASE_URL}/admin/posts/${id}/comments`, {
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
                if (cancelled) return;
                setComments(data.comments ?? null);
                console.log("data: ", data)
            } catch (err) {
                console.error(err);
            }
        }
        loadComments();

        return () => {
            cancelled = true;  // stops before setPost if page about to be changed or component loads again
        };
    }, [secureFetch, id, idIsValid]);

    if (!idIsValid) {
        return <div>Please input a valid id</div>;
    }
    if (!post) return <p>Loading…</p>;
    if (!comments) return <p>Loading…</p>;


    async function togglePostPublishStatus(targetId, currentlyPublished) {
        if (!token) return;
        setErrorMessage("");
        let valueToChangePublishedTo = !currentlyPublished;
        try {
            const response = await secureFetch(`${API_BASE_URL}/admin/posts/${targetId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isPublished: valueToChangePublishedTo }),
            });

            if (!response.ok) {
                let errorMessage = "Failed to update post publish status";
                try {
                    const data = await response.json();
                    errorMessage = data.error ?? errorMessage;
                } catch {
                    console.error("Could not read error message")
                }
                setErrorMessage(errorMessage);
                return;
            }

            const updatedData = await response.json();
            // setPost({ ...post, isPublished: updatedData.isPublished, publishedDate: updatedData.publishedDate })
            setPost((prev) => ({ ...prev, isPublished: updatedData.isPublished, publishedDate: updatedData.publishedDate }))
        } catch (err) {
            console.error(err);
        }
    }

    async function deletePost(targetId) {
        if (!token) return;
        setErrorMessage("");
        try {
            const response = await secureFetch(`${API_BASE_URL}/admin/posts/${targetId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                let errorMessage = "Failed to Delete Post";
                try {
                    const data = await response.json();
                    errorMessage = data.error ?? errorMessage;
                } catch {
                    console.error("Could not read error message");
                    console.log(response);
                }
                setErrorMessage(errorMessage);
                return;
            }
            navigate("/admin", { replace: true });
            // setPost(null);
        } catch (err) {
            console.error(err);
            setErrorMessage("Could not reach the server")
        }
    }

    async function deleteComment(postId, commentId) {
        if (!token) return;
        setErrorMessage("");
        try {
            const response = await secureFetch(`${API_BASE_URL}/admin/posts/${postId}/comments/${commentId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                let errorMessage = "Failed to Delete Comment";
                try {
                    const data = await response.json();
                    errorMessage = data.error ?? errorMessage;
                } catch {
                    console.error("Could not read error message");
                    console.log(response);
                }
                setErrorMessage(errorMessage);
                return;
            }
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        } catch (err) {
            console.error(err)
        }
    }


    return (
        <div>
            <h2>Post Details:</h2>
            {errorMessage && <p role="alert">{errorMessage}</p>}
            <h3>Title: {post.title}</h3>
            <p>Post Body:</p>
            <div
                className="post-body"
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.body ?? ""),
                }}
            />
            <p>Author: {post.author?.username ?? "deleted user"}</p>
            <p>{post.isPublished ? "Published" : "Draft (not published)"} </p>
            <button type="button" onClick={() => togglePostPublishStatus(post.id, post.isPublished)}>{post.isPublished ? "Unpublish post" : "Publish post"}</button>
            <Link to={`/admin/posts/${post.id}/edit`}>Edit post</Link>
            <button type="button" onClick={() => deletePost(post.id)}>Delete post</button>
            <p>Nr of comments: {comments.length}</p>

            <p>Comments:</p>
            <ul>
                {comments.map((comment) => (
                    <li key={comment.id}>
                        <div>{comment.body}</div>
                        <div>{comment.author?.username ?? "deleted user"} - {comment.updatedAt ?? comment.publishedDate}</div>
                        <button type="button" onClick={() => deleteComment(post.id, comment.id)}>Delete Comment</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}