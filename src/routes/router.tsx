import { createBrowserRouter, Navigate } from "react-router-dom";
import matchRoutes from "./matchRoute";
import authRoute from "./authRoute";
import homeRoute from "./homeRoute";

const router = createBrowserRouter([
  {
    errorElement: <Navigate to="/" />,
  },
  ...authRoute,
  ...homeRoute,
  ...matchRoutes,
]);

export default router;
