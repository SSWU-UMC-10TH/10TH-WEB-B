import { type PropsWithChildren, useEffect, useState } from "react";
import { getMyInfo } from "../apis/auth";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { AuthContext } from "./auth";
import type { AuthTokenData } from "../types/auth";

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

    const {
        getItem: getUserIdFromStorage,
        setItem: setUserIdInStorage,
        removeItem: removeUserIdFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.userId);

    const [accessToken, setAccessToken] = useState<string | null>(getAccessTokenFromStorage());
    const [refreshToken, setRefreshToken] = useState<string | null>(getRefreshTokenFromStorage());
    const [userName, setUserName] = useState<string | null>(getUserNameFromStorage());
    const [userId, setUserId] = useState<number | null>(getUserIdFromStorage());

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

    const setAuth = ({ accessToken, refreshToken, name, id }: AuthTokenData) => {
        setAccessTokenInStorage(accessToken);
        setRefreshTokenInStorage(refreshToken);
        setUserNameInStorage(name);
        setUserIdInStorage(id);

        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setUserName(name);
        setUserId(id);
    };

    const updateUserName = (name: string) => {
        setUserNameInStorage(name);
        setUserName(name);
    };

    const clearAuth = () => {
        removeAccessTokenFromStorage();
        removeRefreshTokenFromStorage();
        removeUserNameFromStorage();
        removeUserIdFromStorage();

        setAccessToken(null);
        setRefreshToken(null);
        setUserName(null);
        setUserId(null);
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                refreshToken,
                userName,
                userId,
                setAuth,
                updateUserName,
                clearAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
