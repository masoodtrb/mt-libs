import { useEffect, useState } from 'react';

export function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        fetch(url).then(res => res.json()).then(res => {
            setData(res);
            setIsLoading(false);
        });
    }, [url]);
    return { data, isLoading };
}
