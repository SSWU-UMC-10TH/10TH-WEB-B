import { useInfiniteQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ categoryId, order, limit = 12, search }: PaginationDto) {
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.lps, categoryId, order, search],
        queryFn: ({ pageParam }) =>
            getLpList({ categoryId, order, limit, search, cursor: pageParam }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
            lastPage.hasNext ? lastPage.nextCursor : undefined,
        // 공백만 입력된 경우 요청 차단
        enabled: search === undefined || search === "" || search.trim().length > 0,
        // search가 빈 문자열/공백이면 요청 차단 enabled: search === undefined || search.trim().length > 0,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export default useGetLpList;