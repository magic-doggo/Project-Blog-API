import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSecureFetch } from "../hooks/useSecureFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const secureFetch = useSecureFetch(); //logs out user if they use expired token for api calls
  const { token } = useAuth();
  const [posts, setPosts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    let cancelled = false;
    async function loadPosts() {
      try {
        const response = await secureFetch(`${API_BASE_URL}/posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}` //secureFetch should include this
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

  async function deletePost(id) {
    if (!token) return;
    setErrorMessage("");
    try {
      const response = await secureFetch(`${API_BASE_URL}/posts/${id}`, {
        method: "DELETE",
        // headers: { Authorization: `Bearer ${token}` },
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
      setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      console.error(err);
      setErrorMessage("Could not reach the server")
    }
  }
  async function togglePostPublishStatus(id, currentlyPublished) {
    if (!token) return;
    setErrorMessage("");
    let valueToChangePublishedTo = !currentlyPublished;
    try {
      const response = await secureFetch(`${API_BASE_URL}/posts/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`
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
      setPosts((prev) => {
        const updatedPosts = [];
        for (const post of prev) {
          if (post.id === id) {
            updatedPosts.push({
              ...post,
              isPublished: updatedData.isPublished,
              publishedDate: updatedData.publishedDate,
            });
          } else updatedPosts.push(post);
        }
        return updatedPosts;
      });
      //or this instead: setPosts((prev) =>prev.map((post) => post.id === id ? { ...post, ...updatedData } : post));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Blog posts:</p>
      {posts.length === 0 ? (
        <p>No posts yet</p>
      ) : (
        <div>
          {errorMessage && <p role="alert">{errorMessage}</p>}
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <div>Title: {post.title} - Author: {post.author?.username ?? "deleted user"} - nrofcomments: {post._count.comments}</div>
                <div>{post.isPublished ? "Published" : "Draft (not published)"} </div>
                <button type="button" onClick={() => togglePostPublishStatus(post.id, post.isPublished)}>{post.isPublished ? "Unpublish post" : "Publish post"}</button>
                <button>Edit post</button>
                <button type="button" onClick={() => deletePost(post.id)}>Delete post</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}