import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import AuthLayout from "@/components/layouts/AuthLayout";
import AuthCheckRoute from "@/components/common/AuthCheckRoute";

const authRoute = [
  {
    path: "/auth",
    element: (
      <AuthCheckRoute>
        <AuthLayout />
      </AuthCheckRoute>
    ),
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
    ],
  },
];

export default authRoute;
