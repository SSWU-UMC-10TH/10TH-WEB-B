import type { CommonResponse } from "../types/common";
import { axiosInstance } from "./axios";

type ResponseUploadImageDto = CommonResponse<{
    imageUrl: string;
}>;

export const postImage = async (file: File): Promise<ResponseUploadImageDto> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await axiosInstance.post("/v1/uploads", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return data;
};
