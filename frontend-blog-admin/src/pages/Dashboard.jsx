import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function loadPosts() {
      try {
        const response = await fetch(`${API_BASE_URL}/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        };
        const data = await response.json();
        if (cancelled) return;
        setPosts(data.posts ?? []);
        console.log("data: ", data)
      } catch (err) {
        console.error(err);
      }
    }
    loadPosts();
    return () => {
      console.log('asdasdad')
      cancelled = true;  // stops before setPosts if page about to be changed or component loads again
    };
  }, [token])

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Blog posts:</p>
      {posts.length === 0 ? (
        <p>No posts yet</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <div>Title: {post.title} - Author: {post.author?.username ?? "deleted user"} - nrofcomments: {post._count.comments}</div>
              <div>{post.isPublished ? "Published" : "Drat (not published)"} </div>
              <button>{post.isPublished ? "UNPUBLISH POST" : "Publish post"}</button>
              <button>Edit post</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}