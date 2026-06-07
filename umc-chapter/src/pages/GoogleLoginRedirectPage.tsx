import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useNavigate } from "react-router-dom";

const GoogleLoginRedirectPage = () => {
    const {setItem: setAccessToken} = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const {setItem: setRefreshToken} = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
    const navigate = useNavigate();
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');

        if (accessToken) {
            // 1. JSON.stringify를 해서 저장 (axios interceptor의 JSON.parse와 맞추기 위함)
            localStorage.setItem(LOCAL_STORAGE_KEY.accessToken, JSON.stringify(accessToken));
            if (refreshToken) {
                localStorage.setItem(LOCAL_STORAGE_KEY.refreshToken, JSON.stringify(refreshToken));
            }

            // 2. navigate 대신 window.location.href 사용 (앱 전체 상태 초기화를 위해)
            // AuthContext의 useEffect가 새로고침되면서 토큰을 읽어갈 수 있게 해줌
            window.location.href = "/me";
        } else {
            alert("로그인 정보가 없습니다.");
            window.location.href = "/login";
        }
    }, []);

    return (
        <div>구글 로그인 리다이렉트 화면</div>
    )
}

export default GoogleLoginRedirectPage;