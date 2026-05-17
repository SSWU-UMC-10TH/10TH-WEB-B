import LpCardSkeleton from "./LpCardSkeleton";

interface LpCardSkeletonProps {
  count: number;
}

const LpCardSkeletonList = ({ count }: LpCardSkeletonProps) => {
  return (
    <>
      {new Array(count).fill(0).map((_, idx) => (
        <LpCardSkeleton key={idx} />
      ))}
    </>
  );
};

export default LpCardSkeletonList;
