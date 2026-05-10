import type { PaginationDto } from "../types/common";
import type { ResponseLpListDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto: PaginationDto): Promise<ResponseLpListDto> => {
    const params = {
        ...paginationDto,
        search: paginationDto.search ? paginationDto.search : undefined,
    };

    const { data } = await axiosInstance.get("/v1/lps", {
        params,
    });

    return data;
};
