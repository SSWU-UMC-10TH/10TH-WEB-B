import type { PaginationDto } from "../../types/common";
import { useQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
    return useQuery({
        queryKey: [QUERY_KEY.lps, order, { search, cursor, limit }],
        queryFn: () =>
            getLpList({
                cursor,
                search,
                order,
                limit,
            }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export default useGetLpList;
