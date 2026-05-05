import type { RequestSigninDto } from "../types/auth";
import { createContext, useContext, useState, type PropsWithChildren, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";
import { postSignin } from "../apis/auth";
import { getMe } from "../apis/user"; 
interface User {
    id: number;
    name: string;
}

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    isLoading: boolean; 
    login: (signInData: RequestSigninDto, onSuccess?: () => void) => Promise<void>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    user: null,
    isLoading: true,
    login: async () => {},
    logout: async () => {},
})

export const AuthProvider = ({children}: PropsWithChildren) => {
    // 수정: 중복 선언되었던 상태들을 하나로 통합
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    
    // 로컬 스토리지 훅 사용
    const { setItem: setAccessTokenInStorage, removeItem: removeAccessTokenFromStorage } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    const { setItem: setRefreshTokenInStorage, removeItem: removeRefreshTokenFromStorage } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    // 수정: 실제 API를 사용하여 내 정보를 가져옵니다.
    const fetchUser = async () => {
        try {
            const userData = await getMe(); // /v1/users/me 호출
            setUser({ id: userData.id, name: userData.name }); // name 필드 사용
        } catch (e) {
            console.error("내 정보 불러오기 실패:", e);
            logout();
        }
    };

    useEffect(() => {
        const rawAccessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
        if (rawAccessToken) {
            const token = JSON.parse(rawAccessToken);
            setAccessToken(token);
            fetchUser(); // 토큰 있으면 유저 정보 가져오기
        }
        setIsLoading(false);
    }, []);

    const login = async (signInData: RequestSigninDto, onSuccess?: () => void) => {
        try {
            const response = await postSignin(signInData);

            if (response.accessToken) {
                // 스토리지 저장
                setAccessTokenInStorage(response.accessToken);
                setRefreshTokenInStorage(response.refreshToken);
                
                // 상태 업데이트
                setAccessToken(response.accessToken);
                setRefreshToken(response.refreshToken);
                
                // 추가: 로그인 성공 후 유저 정보 불러오기
                await fetchUser();
                
                alert("로그인 성공!");
                onSuccess?.();
            }
        } catch (error) {
            console.error("로그인 실패:", error);
            alert("로그인에 실패했습니다. 다시 시도해주세요.");
        }
    }

    const logout = async () => {
        console.trace("logout 호출됨");
        try {
            // 스토리지 삭제
            removeAccessTokenFromStorage();
            removeRefreshTokenFromStorage();
            
            // 상태 초기화
            setAccessToken(null);
            setRefreshToken(null);
            setUser(null); // 추가: 유저 정보도 삭제
            
            alert("로그아웃 성공!");
        } catch (error) {
            console.error("로그아웃 실패:", error);
            alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
        }
    }

    return (
        <AuthContext.Provider value={{accessToken, refreshToken, user, isLoading, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }
    return context;
}