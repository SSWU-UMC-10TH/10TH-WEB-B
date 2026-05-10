import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { getLpComments } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { PAGINATION_ORDER } from "../../enums/common";
import type { ResponseLpCommentsDto } from "../../types/lp";

function useGetInfiniteComments(lpId: string | undefined, limit: number, order: PAGINATION_ORDER) {
    return useInfiniteQuery<
        ResponseLpCommentsDto,
        Error,
        InfiniteData<ResponseLpCommentsDto>,
        [typeof QUERY_KEY.lpComments, string | undefined, PAGINATION_ORDER],
        number | undefined
    >({
        queryKey: [QUERY_KEY.lpComments, lpId, order],
        queryFn: ({ pageParam }) =>
            getLpComments({
                lpId: lpId!,
                cursor: pageParam,
                limit,
                order,
            }),
        initialPageParam: undefined,
        getNextPageParam: (lastPage) =>
            lastPage.data.hasNext ? lastPage.data.nextCursor : undefined,
        enabled: !!lpId,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export default useGetInfiniteComments;
