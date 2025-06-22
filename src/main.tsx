// import { StrictMode } from 'react'
import { createRoot } from "react-dom/client";
import "./style/main.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={client}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
