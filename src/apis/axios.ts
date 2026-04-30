// import axios from "axios";
// import { LOCAL_STORAGE_KEY } from "../constants/key";

// export const axiosInstance = axios.create({
//     baseURL: import.meta.env.VITE_SERVER_API_URL,
//     headers: {
//         Authorization: 'Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}',
//     }
// });
import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
});

// 요청 인터셉터 (AccessToken 붙이기)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);

  if (token) {
    config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
  }

  return config;
});

// 응답 인터셉터 (RefreshToken 로직)
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as any;

    // 401 + 재시도 안 했을 때
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const raw = localStorage.getItem(
          LOCAL_STORAGE_KEY.refreshToken
        );
        const refreshToken = raw ? JSON.parse(raw) : null;

        if (!refreshToken) throw new Error("No refresh token");

        // refresh 요청 (여기 axiosInstance 말고 axios 써야 함)
        const { data } = await axios.post(
          `${import.meta.env.VITE_SERVER_API_URL}/v1/auth/refresh`,
          {
            refreshToken: JSON.parse(refreshToken),
          }
        );

        const newAccessToken = data.data.accessToken;
        if (!newAccessToken) throw new Error("Invalid refresh response");

        // 새 accessToken 저장
        localStorage.setItem(
          LOCAL_STORAGE_KEY.accessToken,
          JSON.stringify(newAccessToken)
        );

        // 원래 요청에 토큰 다시 넣기
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 실패했던 요청 재시도
        return axiosInstance(originalRequest);

      } catch (err) {
        // ❗ refresh도 실패하면 로그인으로
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);