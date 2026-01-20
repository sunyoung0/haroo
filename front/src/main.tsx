import React from "react";
import ReactDOM from "react-dom/client";
import "./globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginForm from "./components/auth/LoginForm";
import SignUp from "./components/auth/SignUpForm";
import LoadingPage from "./pages/LoadingPage";
import MainPage from "./pages/MainPage";
import { SnackbarProvider } from "./context/SnackbarContext";
import { useAuthStore } from "./store/useAuthStore";
import { Navigate } from "react-router-dom";
import DiaryGroupPage from "./pages/DiaryGroupPage";
import DiaryWritePage from "./pages/DiaryWritePage";
import DiaryDetailPage from "./pages/DiaryDetailPage";

// 루트  경로에서 로그인 여부를 판단하여 페이지 선택해줌
// eslint-disable-next-line react-refresh/only-export-components
const RootRoute = () => {
  const { isLoggedIn } = useAuthStore();

  if (isLoggedIn === undefined) return <LoadingPage />;
  return (
    <>
      {isLoggedIn ? (
        <MainPage key={"main-page"} />
      ) : (
        <LoadingPage key={"loading-page"} />
      )}
    </>
  );
};

// 라우터 설정
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />,
    // 에러 발생 시 보여줄 화면 (직접 만든 에러 페이지 컴포넌트 넣어도 됨)
    errorElement: <div className="p-10">알 수 없는 오류가 발생했습니다. 새로고침 해주세요.</div>,
  },
  {
    path: "/auth/login",
    element: <LoginForm />,
  },
  {
    path: "/auth/register",
    element: <SignUp />,
  },
  {
    path: "/diaries/:groupId",
    element: <DiaryGroupPage />,
  },
  {
    path: "/diaries/write/:groupId",
    element: <DiaryWritePage />,
  },
  {
    path: "/diaries/detail/:diaryId",
    element: <DiaryDetailPage />,
  },
  // 잘못된 경로 접근 시 홈으로 리다이렉트
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SnackbarProvider>
      <RouterProvider router={router} />
    </SnackbarProvider>
  </React.StrictMode>
);
