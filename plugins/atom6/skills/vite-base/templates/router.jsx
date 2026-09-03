// src/router.jsx
// Página nova = arquivo em src/pages/ + uma entrada aqui.
import { createBrowserRouter } from "react-router";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicOnlyRoute from "@/components/auth/PublicOnlyRoute";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Forbidden from "@/pages/Forbidden";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <PublicOnlyRoute />,
    children: [{ index: true, element: <Login /> }],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "sem-permissao", element: <Forbidden /> },
          // { path: "relatorios", element: <Reports /> },
          // {
          //   element: <ProtectedRoute roles={["admin"]} />,
          //   children: [{ path: "usuarios", element: <Users /> }],
          // },
        ],
      },
    ],
  },

  { path: "*", element: <NotFound /> },
]);
