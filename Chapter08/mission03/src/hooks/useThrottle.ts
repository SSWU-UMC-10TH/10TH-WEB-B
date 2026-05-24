import { useCallback, useEffect, useRef } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function useThrottle<T extends (...args: any[]) => void>(
    callback: T,
    delay: number = 500
): (...args: Parameters<T>) => void {
    const lastExecuted = useRef<number>(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const callbackRef = useRef<T>(callback);

    useEffect(() => {
        callbackRef.current = callback;
    });

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [delay]);

    return useCallback((...args: Parameters<T>) => {
        const now = Date.now();
        if (now >= lastExecuted.current + delay) {
            lastExecuted.current = now;
            callbackRef.current(...args);
        } else {
            if (timerRef.current) clearTimeout(timerRef.current);
            const remaining = delay - (now - lastExecuted.current);
            timerRef.current = setTimeout(() => {
                lastExecuted.current = Date.now();
                console.log("[useThrottle] 실행됨");
                callbackRef.current(...args);
            }, remaining);
        }
    }, [delay]);
}

export default useThrottle;
