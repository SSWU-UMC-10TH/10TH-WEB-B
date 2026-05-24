import { useState } from "react";
import useThrottle from "../hooks/useThrottle";

const ThrottlePage = () => {
    const [scrollY, setScrollY] = useState<number>(0);

    const handleScroll = useThrottle((e: React.UIEvent<HTMLDivElement>) => {
        const top = (e.target as HTMLDivElement).scrollTop;
        console.log("throttled scroll:", top);
        setScrollY(top);
    }, 2000);

    return (
        <div
            onScroll={handleScroll}
            style={{ background: "linear-gradient(to bottom, #111, #444)" }}
            className="h-dvh overflow-y-auto flex flex-col items-center text-white"
        >
            <div className="sticky top-8 text-center">
                <h1>쓰로틀링이 무엇일까요?</h1>
                <p>ScrollY: {scrollY}px</p>
            </div>
            <div style={{ height: "300vh" }} />
        </div>
    );
};

export default ThrottlePage;
