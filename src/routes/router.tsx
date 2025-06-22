import { createBrowserRouter, Navigate } from "react-router-dom";
import matchRoutes from "./matchRoute";
import authRoute from "./authRoute";



const router = createBrowserRouter([
    {
        errorElement: <Navigate to="/" />
    },
    ...authRoute,
    ...matchRoutes,
])

export default router;