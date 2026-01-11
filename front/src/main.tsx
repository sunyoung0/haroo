import React from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignUp from "./components/auth/SignUpForm";
import MainPage from "./pages/MainPage";
import { SnackbarProvider } from "./context/SnackbarContext";

// 라우터 설정
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/auth/login",
    element: <LoginForm />,
  },
  {
    path: "/auth/register",
    element: <SignUp />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SnackbarProvider>
      <RouterProvider router={router} />
    </SnackbarProvider>
  </React.StrictMode>
);
