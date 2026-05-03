import { type PaginationDto } from "../types/common";
import { type ResponseLpCommentsDto, type ResponseLpListDto } from "../types/lp";
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
