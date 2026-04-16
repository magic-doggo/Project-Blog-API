import App from "./App";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
// import ErrorPage from "./pages/ErrorPage";

const routes = [
    {
        path: "/",
        element: <App />,
        //errorElement: <ErrorPage />,
        children: [
            {
                path: "",
                element: <Dashboard />
            },
            {
                path: "login",
                element: <Login />
            }
        ]
    }
]

export default routes;