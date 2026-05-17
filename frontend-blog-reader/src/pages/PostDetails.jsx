import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";
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
    // const [comments, setComments] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    const secureFetch = useSecureFetch();

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
        return () => {
            cancelled = true;  // stops before setPost if page about to be changed or component loads again
        };
    }, [id, idIsValid]);

    if (!idIsValid) {
        return <div>Please input a valid id</div>;
    }
    if (!post) return <p>Loading…</p>;

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

            {/* <p>NrOfCommentsIconPlaceholder: {post._count.comments}</p> */}
            {/* <p>Comments:</p>
            <ul>
                {comments.map((comment) => {
                    <li key={comment.id}>
                        <div>{comment.body}</div>
                        <div>{comment.author} - {comment.updatedAt ?? comment.publishedDate}</div>
                    </li>
                })}
            </ul> */}
        </div>
    )
}