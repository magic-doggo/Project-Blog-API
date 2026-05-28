import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NewPost from "./pages/NewPost"
import PostDetails from "./pages/PostDetails";
import EditPost from "./pages/EditPost"
import ErrorPage from "./components/ErrorPage";

const routes = [
    {
        path: "/admin",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        path: "",
                        element: <Dashboard />
                    },
                    {
                        path: "newPost",
                        element: <NewPost/>
                    },
                    {
                        path: "posts/:postId",
                        element: <PostDetails />,
                    },
                    {
                        path: "posts/:postId/edit",
                        element: <EditPost />
                    }
                ]
            },
            {
                path: "login",
                element: <Login />
            }
        ]
    }
]

export default routes;