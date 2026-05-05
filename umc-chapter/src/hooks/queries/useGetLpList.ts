import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ categoryId, order, limit, cursor, search }: PaginationDto) {
    return useQuery({
        queryKey: [QUERY_KEY.lps, categoryId],
        queryFn: () => getLpList({ categoryId }),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}



export default useGetLpList;