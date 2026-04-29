import { useEffect, useState } from "react";
import axios from 'axios';

export const useCustomFetch = <T>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsPending(true);
            setIsError(false); 
            try {
                const response = await axios.get<T>(
                    `https://api.themoviedb.org/3${url}`,
                    {
                        headers: {
                            Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                        },
                    }
                );
                setData(response.data);
            } catch (err) {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchData();
    }, [url]); 

    return { data, isPending, isError };
};