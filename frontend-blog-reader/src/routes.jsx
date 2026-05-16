import App from "./App";
// import ProtectedRoute from "./components/ProtectedRoute";
// import Login from "./pages/Login";
// import ErrorPage from "./pages/ErrorPage";

const routes = [
    {
        path: "/",
        element: <App />,
        //errorElement: <ErrorPage />,
        children: [
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