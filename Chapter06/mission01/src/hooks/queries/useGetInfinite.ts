import { useInfiniteQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpList } from "../../apis/lp";
import type { PAGINATION_ORDER } from "../../enums/common";

function useGetInfiniteList(limit: number, search: string, order: PAGINATION_ORDER) {
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.lps, "infinite", { limit, search, order }],
        queryFn: ({ pageParam }) =>
            getLpList({
                cursor: pageParam,
                limit,
                search,
                order,
            }),
        initialPageParam: undefined as number | undefined,
        getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    });
}

export default useGetInfiniteList;
