import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key.ts";
import type { RequestLpDto } from "../../types/lp.ts";
import { getLpDetail } from "../../apis/lp.ts";

function useGetLpDetail({ lpid }: RequestLpDto) {
    return useQuery({
        queryKey: [QUERY_KEY.lps, lpid],
        queryFn: () => getLpDetail({ lpid }),
        enabled: !!lpid,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });
}

export default useGetLpDetail;
