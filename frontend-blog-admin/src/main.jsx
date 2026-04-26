import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import routes from "./routes";
import { AuthProvider } from './context/AuthContext';

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster position='top-right' richColors closeButton/>    {/* https://sonner.emilkowal.ski/ */}
      <RouterProvider router={router} /> 
    </AuthProvider>
  </StrictMode>,
);

 