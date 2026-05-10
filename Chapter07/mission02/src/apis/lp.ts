import { type PaginationDto } from "../types/common";
import {
    type RequestCreateCommentDto,
    type RequestCreateLpDto,
    type RequestDeleteCommentDto,
    type RequestDeleteLpDto,
    type RequestLpDto,
    type RequestUpdateLpDto,
    type RequestUpdateCommentDto,
    type ResponseCommentDto,
    type ResponseCreateLpDto,
    type ResponseDeleteCommentDto,
    type ResponseDeleteLpDto,
    type ResponseLikeDto,
    type ResponseLpCommentsDto,
    type ResponseLpDto,
    type ResponseLpListDto,
    type ResponseUpdateLpDto,
} from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async ({
    cursor,
    limit,
    order,
}: PaginationDto): Promise<ResponseLpListDto> => {
    const { data } = await axiosInstance.get("/v1/lps", {
        params: { cursor, limit, order },
    });

    return data;
};

export const getLpComments = async ({
    lpId,
    cursor,
    limit,
    order,
}: PaginationDto & { lpId: string }): Promise<ResponseLpCommentsDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
        params: { cursor, limit, order },
    });

    return data;
};

export const postLpComment = async ({
    lpId,
    content,
}: RequestCreateCommentDto): Promise<ResponseCommentDto> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content });

    return data;
};

export const patchLpComment = async ({
    lpId,
    commentId,
    content,
}: RequestUpdateCommentDto): Promise<ResponseCommentDto> => {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpId}/comments/${commentId}`, {
        content,
    });

    return data;
};

export const deleteLpComment = async ({
    lpId,
    commentId,
}: RequestDeleteCommentDto): Promise<ResponseDeleteCommentDto> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);

    return data;
};

export const postLp = async (body: RequestCreateLpDto): Promise<ResponseCreateLpDto> => {
    const { data } = await axiosInstance.post("/v1/lps", body);

    return data;
};

export const patchLp = async ({
    lpid,
    ...body
}: RequestUpdateLpDto): Promise<ResponseUpdateLpDto> => {
    const { data } = await axiosInstance.patch(`/v1/lps/${lpid}`, body);

    return data;
};

export const deleteLp = async ({ lpid }: RequestDeleteLpDto): Promise<ResponseDeleteLpDto> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpid}`);

    return data;
};

export const postLpLike = async (lpid: number | string): Promise<ResponseLikeDto> => {
    const { data } = await axiosInstance.post(`/v1/lps/${lpid}/likes`);

    return data;
};

export const deleteLpLike = async (lpid: number | string): Promise<ResponseLikeDto> => {
    const { data } = await axiosInstance.delete(`/v1/lps/${lpid}/likes`);

    return data;
};

export const getLpDetail = async ({ lpid }: RequestLpDto): Promise<ResponseLpDto> => {
    const { data } = await axiosInstance.get(`/v1/lps/${lpid}`);

    return data;
};
