import { useQuery } from "@tanstack/react-query";
import type { PaginationDto } from "../../types/common";
import { getLplist } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { boolean } from "zod";
import type { ResponseLpListDto } from "../../types/lp";

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: () =>
      getLplist({
        cursor,
        search,
        order,
        limit,
      }),
    //데이터가 신선하다고 간주하는 시간
    //이 시간동안 캐시된 데이터를 그대로 사용. 컴포넌트가 마운트 되거나 창에 포커스 들어오는 경우도 재요청 안함
    //5분 동안 기존 데이터를 그대로 활용해서 네트워크 요청을 줄인다.
    staleTime: 1000 * 60 * 5, //5분
    // 사용되지 않는(비활성 상태) 인 쿼리 데이터가 캐시에 남아있는 시간.
    //staleTime이 지나고 데이터가 신선하지 않더라도, 일정 시간 동안 메모리에 보관
    //그 이후에 해당 쿼리가 전혀 사용되지 않으면 gcTime이 지난 후에 제거
    gcTime: 100 * 60 * 10, //10분

    //조건에 따라 쿼리를  실행여부 제어
    //enabled: Boolean(search),

    //refetchInterval: 100*60,
    //retry: 쿼리요청이 실패했을 때 자동으로 재시도 할 횟수 지정.

    //initialData: 쿼리 실행 전 미리 제공할 초기 ㄷ데이터 설정
    //initialData: initialLpListData,

    //파라미터가 변경 될 때 이전데이터를 유지해서 깜빡임 줄여줌
    //keepPreviousData: true,

    select: (data) => data.data.data,
  });
}

export default useGetLpList;
