import type { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import { axiosClient } from "../apis/axiosClient";

const useFetch = <T>(url: string, options?: AxiosRequestConfig) => {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {
                const response = await axiosClient.get(url,{
                    ...options,
                });
                setData(response.data);
            } catch {
                setError('An error occurred while fetching data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url, options]);

    return {
        data,
        error,
        isLoading,
    }
}

export default useFetch;