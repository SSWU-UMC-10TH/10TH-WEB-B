import { useEffect, useState } from "react";
import useGetLpList from "../hooks/queries/useGetLpList";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import type { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import LpCardSkeleton from "../components/LpCard/LpCardSkeleton";
import LpCard from "../components/LpCard/LpCard";

const HomePage = () => {
  const [search, setSearch] = useState("");
  //const { data, isPending, isError, error } = useGetLpList({
  //  search,
  //  limit: 50,
  //});
  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(10, search, "asc" /*PAGINATION_ORDER.asc*/);

  //ref, inView
  //ref->특정한 html요소 감시
  //inView-> 그 요소가 화면에 보이면 true
  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (isError) {
    return <div className={"mt-20"}>Error...</div>;
  }

  //console.log(lps?.pages.map((page)=>console.log(page)));

  return (
    <div className="container mx-auto px-4 py-6">
      <input value={search} onChange={(e) => setSearch(e.target.value)} />

      <div
        className={
          "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        }
      >
        {isPending && <LpCardSkeletonList count={20} />}
        {lps?.pages
          ?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        {isFetching && <LpCardSkeletonList count={20} />}
      </div>
      <div ref={ref} className="h-2" />
    </div>
  );
};

export default HomePage;
