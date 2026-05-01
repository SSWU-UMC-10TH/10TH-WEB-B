import axios, { type InternalAxiosRequestConfig } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean; // 재시도 여부를 나타내는 플래그
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
})



axiosInstance.interceptors.request.use((config) => {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const token = raw ? JSON.parse(raw) : null;

    if (token){
        config.headers = config.headers || {};
        if (!config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        console.log("Authorization:", config.headers.Authorization);
    }

    return config;
},
    (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest: CustomInternalAxiosRequestConfig = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            if(originalRequest.url === "/v1/auth/refresh") {
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                window.location.href = "/login";
                return Promise.reject(error);
            }

            originalRequest._retry = true;

            if (!refreshPromise) {
                refreshPromise = (async () => {
                    const rawRefresh = localStorage.getItem(LOCAL_STORAGE_KEY.refreshToken);
                    const refreshToken = rawRefresh ? JSON.parse(rawRefresh) : null;

                    const {data} = await axiosInstance.post("/v1/auth/refresh", {refresh: refreshToken});
                    console.log("refresh response:", data); 
                    localStorage.setItem(
                        LOCAL_STORAGE_KEY.accessToken,
                        JSON.stringify(data.accessToken)
                    );
                    if (data.refreshToken) {
                        localStorage.setItem(
                            LOCAL_STORAGE_KEY.refreshToken,
                            JSON.stringify(data.refreshToken)
                        );
                    }

                    return data.accessToken;
                }
            )().catch((error) => {
                localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
                localStorage.removeItem(LOCAL_STORAGE_KEY.refreshToken);
                throw error; 

            }).finally(() => {
                refreshPromise = null;
            });
        }
        return refreshPromise.then((newAccessToken) => {

            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return axiosInstance.request(originalRequest);
        })
        
    }
    return Promise.reject(error);
}
)