import axios from "axios";
import type { AxiosInstance } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
    const storedAccessToken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
    const accessToken = storedAccessToken ? JSON.parse(storedAccessToken) : null;

    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});
