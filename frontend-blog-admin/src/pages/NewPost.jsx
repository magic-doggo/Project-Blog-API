import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Editor } from '@tinymce/tinymce-react';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function NewPost() {
    const editorRef = useRef(null);
    // const log = () => {
    //     if (editorRef.current) {
    //         console.log(editorRef.current.getContent());
    //     }
    // };
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [postBody, setPostBody] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { token } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        //maybe some frontend validation

        const html =
            editorRef.current?.getContent({ format: "html" }) ?? postBody;
        const textOnly =
            editorRef.current?.getContent({ format: "text" })?.trim() ?? "";
        if (!textOnly) {
            setErrorMessage("Body cannot be empty.");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/admin/posts`, {
                method: "POST",
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
            navigate(`/admin/posts/${data.post.id}`)// will edit to go to /data.post.id once I create a page for individual posts

        } catch (err) {
            console.error(err);
        }
    }
    return (
        <div>

            {/* <Editor
                apiKey=''
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue="<p>This is the initial content of the editor.</p>"
                init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
            <button onClick={log}>Log editor content</button> */}

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

                {/* <label htmlFor="postBody">Body: </label>
                <input
                    id="postBody"
                    type="text"
                    name="postBody"
                    value={postBody}
                    onChange={(e) => {
                        setPostBody(e.target.value); setErrorMessage("");
                    }} required
                /> */}

                <label htmlFor="postBody">Body:</label>
                <Editor
                    id="postBody"
                    textareaName="postBody"
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    onInit={(_evt, editor) => {
                        editorRef.current = editor;
                    }}
                    onEditorChange={(content) => setPostBody(content)}
                    initialValue=""
                    init={{
                        height: 400,
                        menubar: false,
                        plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "charmap",
                            "preview",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "help",
                            "wordcount",
                        ],
                        toolbar:
                            "undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | code help",
                        content_style:
                            "body { font-family: Helvetica, Arial, sans-serif; font-size: 14px }",
                    }}
                />

                {errorMessage && <p role="alert">{errorMessage}</p>}
                <button type="submit">Create Post</button> <span>You will get the chance to review the post before publishing to public</span>
                {/* should redirect to this specific post page after submission, for review. which means I will probably create a spearate page for postId for admin vs user */}
            </form>
        </div>
    );
}