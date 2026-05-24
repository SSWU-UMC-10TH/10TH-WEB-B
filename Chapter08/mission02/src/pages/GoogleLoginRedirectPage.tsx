import { useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

const GoogleLoginRedirectPage = () => {
    const { setItem: setAccessToken } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { setItem: setRefreshToken } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
    const { setItem: setUserName } = useLocalStorage(LOCAL_STORAGE_KEY.userName);
    const { setItem: setUserId } = useLocalStorage(LOCAL_STORAGE_KEY.userId);

    useEffect(() => {
        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const accessToken: string | null = urlParams.get(LOCAL_STORAGE_KEY.accessToken);
        const refreshToken: string | null = urlParams.get(LOCAL_STORAGE_KEY.refreshToken);
        const userName: string | null = urlParams.get(LOCAL_STORAGE_KEY.userName);
        const userId: string | null = urlParams.get(LOCAL_STORAGE_KEY.userId);

        if (accessToken) {
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);
            setUserName(userName);
            setUserId(userId ? Number(userId) : null);
            window.location.href = "/my";
        }
    }, [setAccessToken, setRefreshToken, setUserId, setUserName]);

    return <div>구글 로그인 리다이렉 화면</div>;
};

export default GoogleLoginRedirectPage;
