import {useAuth} from "../contexts/AuthContext.tsx"
import {Navigate, Outlet} from "react-router-dom"

export const ProtectedLayout = () => {
    const {accessToken, isLoading} = useAuth();

    // 토큰을 읽어오는 중일 때는 아무것도 띄우지 않거나 로딩 스피너를 보여줌
    if (isLoading) {
        return <div>인증 확인 중...</div>; 
    }

    if(!accessToken){
        return <Navigate to={'/login'} replace/>
    }

    return <Outlet/>
}