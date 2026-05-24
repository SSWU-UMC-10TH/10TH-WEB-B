import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { PAGINATION_ORDER } from "../../enums/common";
import { QUERY_KEY } from "../../constants/key";
import { type ResponseLpListDto } from "../../types/lp";

function useGetInfiniteList(
    limit: number,
    search: string,
    sort: PAGINATION_ORDER,
    enabled = true,
) {
    return useInfiniteQuery<
        ResponseLpListDto,
        Error,
        InfiniteData<ResponseLpListDto>,
        [typeof QUERY_KEY.lps, PAGINATION_ORDER, string],
        number | undefined
    >({
        queryKey: [QUERY_KEY.lps, sort, search],
        queryFn: ({ pageParam }) =>
            getLpList({ cursor: pageParam, limit, order: sort, search }),
        enabled,

        initialPageParam: undefined,

        getNextPageParam: (lastPage) =>
            lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,

        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export default useGetInfiniteList;
