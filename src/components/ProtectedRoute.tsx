// import { Navigate } from "react-router-dom";
// import { LOCAL_STORAGE_KEY } from "../constants/key";

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

//   // 토큰 없으면 로그인 페이지로 이동
//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }

//   // 있으면 원래 페이지 보여줌
//   return <>{children}</>;
// };

// export default ProtectedRoute;
import { Navigate, useLocation } from "react-router-dom";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  const location = useLocation();

  // 토큰 없으면 모달 + 이동
  if (!token) {
    const goLogin = window.confirm("로그인이 필요합니다. 이동할까요?");
    
    if (goLogin) {
      return (
        <Navigate
          to="/login"
          state={{ from: location }} 
          replace
        />
      );
    }

    return null; // 취소 누르면 아무것도 안 함
  }

  return <>{children}</>;
};

export default ProtectedRoute;