import App from "./App";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NewPost from "./components/NewPost"
// import ErrorPage from "./pages/ErrorPage";

const routes = [
    {
        path: "/",
        element: <App />,
        //errorElement: <ErrorPage />,
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