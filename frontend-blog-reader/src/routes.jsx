import App from "./App";
// import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
// import ErrorPage from "./pages/ErrorPage";

const routes = [
    {
        path: "/",
        element: <App />,
        //errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <Home/>
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