import type {
    RequestSigninDto,
    RequestSignupDto,
    ResponseSigninDto,
    ResponseSignupDto,
    ResponseMyInfoDto,
} from "../types/auth.ts";
import { axiosInstance } from "./axios.ts";

export const postSignup = async (body: RequestSignupDto): Promise<ResponseSignupDto> => {
    const { data } = await axiosInstance.post("/v1/auth/signup", body);

    return data;
};

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
    const { data } = await axiosInstance.post(
        import.meta.env.VITE_SERVER_API_URL + "/v1/auth/signin",
        body,
    );

    return data;
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
    const { data } = await axiosInstance.get("/v1/auth/me");

    return data;
};

export const postLogout = async () => {
    const { data } = await axiosInstance.post("/v1/auth/signout");

    return data;
};
