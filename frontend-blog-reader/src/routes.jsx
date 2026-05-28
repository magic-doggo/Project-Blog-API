import App from "./App";
// import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
import Login from "./pages/Login";
import Register from "./pages/Register"
import ErrorPage from "./components/ErrorPage";

const routes = [
    {
        path: "/",
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "posts/:postId",
                element: <PostDetails />,
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            }
            // {
            //     element: <ProtectedRoute />,
            //     children: [
            //     ]
            // },
            // {
            //     path: "login",
            //     element: <Login />
            // }
        ]
    }
]

export default routes;