import { useState, useEffect } from "react";

export function useCustomFetch<T>(fetcher: () => Promise<T>, deps: React.DependencyList) {
    const [data, setData] = useState<T>();
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setIsPending(true);
                const result = await fetcher();
                setData(result);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovies();
    }, deps);

    return { data, isPending, isError };
}
