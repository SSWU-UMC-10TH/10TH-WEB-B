import { useAuth } from "../contexts/AuthContext.tsx";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";

export const ProtectedLayout = () => {
    const { accessToken, isLoading } = useAuth();
    const location = useLocation();

    // 수정: alert은 렌더링 중이 아니라 useEffect에서 한 번만!
    useEffect(() => {
        if (!isLoading && !accessToken) {
            alert("로그인이 필요한 서비스입니다.");
        }
    }, [isLoading, accessToken]);

    // 인증 확인 중에는 아무것도 하지 않음 (루프 방지)
    if (isLoading) return null;

    // 토큰이 없으면 로그인 페이지로. (홈(/)에서는 이 레이아웃이 작동하지 않아야 함)
    if (!accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};