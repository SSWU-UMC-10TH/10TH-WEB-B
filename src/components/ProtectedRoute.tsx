import { Navigate } from "react-router-dom";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  // 토큰 없으면 로그인 페이지로 이동
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 있으면 원래 페이지 보여줌
  return <>{children}</>;
};

export default ProtectedRoute;