import { useEffect, useState } from "react";
import axios from "axios";

export function useCustomFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<T>(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
          },
        });
        setData(response.data);
      } catch (e) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (url) fetchData();
  }, [url]);

  return { data, isLoading, isError };
}
