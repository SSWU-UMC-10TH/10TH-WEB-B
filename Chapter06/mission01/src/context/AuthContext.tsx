import { type PropsWithChildren, useEffect, useState } from "react";
import { getMyInfo, postLogout, postSignin } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AuthContext } from "./auth";
import type { RequestSigninDto } from "../types/auth";

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const {
        getItem: getAccessTokenFromStorage,
        setItem: setAccessTokenInStorage,
        removeItem: removeAccessTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const {
        getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokenInStorage,
        removeItem: removeRefreshTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const {
        getItem: getUserNameFromStorage,
        setItem: setUserNameInStorage,
        removeItem: removeUserNameFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.userName);

    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage());
    const [userName, setUserName] = useState<string | null>(getUserNameFromStorage());

    useEffect(() => {
        if (!accessToken || userName) return;

        const syncUserName = async () => {
            try {
                const response = await getMyInfo();
                const name = response.data.name;

                setUserName(name);
                setUserNameInStorage(name);
            } catch (error) {
                console.error("사용자 정보 조회 오류", error);
            }
        };

        void syncUserName();
    }, [accessToken, setUserNameInStorage, userName]);

    const login = async (signinData: RequestSigninDto) => {
        try {
            const { data } = await postSignin(signinData);

            if (data) {
                const newAccessToken = data.accessToken;
                const newRefreshToken = data.refreshToken;
                const newUserName = data.name;

                setAccessTokenInStorage(newAccessToken);
                setRefreshTokenInStorage(newRefreshToken);
                setUserNameInStorage(newUserName);

                setAccessToken(newAccessToken);
                setRefreshToken(newRefreshToken);
                setUserName(newUserName);

                alert("로그인 성공");
                window.location.href = "/my";
            }
        } catch (error) {
            console.error("로그인 오류", error);
            alert("로그인 실패");
        }
    };

    const logout = async () => {
        try {
            await postLogout();
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            removeUserNameFromStorage();

            setAccessToken(null);
            setRefreshToken(null);
            setUserName(null);

            alert("로그아웃 성공");
        } catch (error) {
            console.error("로그아웃 오류", error);
            alert("로그아웃 실패");
        }
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, userName, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
