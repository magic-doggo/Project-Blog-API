import App from "./App";
// import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import PostDetails from "./pages/PostDetails";
// import ErrorPage from "./pages/ErrorPage";

const routes = [
    {
        path: "/",
        element: <App />,
        //errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home />
            },
            {
                path: "posts/:postId",
                element: <PostDetails />,
            },
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