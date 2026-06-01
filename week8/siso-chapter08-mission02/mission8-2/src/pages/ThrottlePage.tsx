import { useEffect, useState, useRef } from "react";
import useThrottle from "../hooks/useThrottle";

const ThrottlePage = () => {
  const [scrollY, setScrollY] = useState<number>(0);
  const targetRef = useRef<HTMLDivElement>(null);

  const throttledScrollY = useThrottle(scrollY, 2000);

  useEffect(() => {
    console.log("ScrollY: ", throttledScrollY);
  }, [throttledScrollY]);

  useEffect(() => {
    if (!targetRef.current) return;

    let scrollParent: HTMLElement | Window | null =
      targetRef.current.parentElement;
    while (scrollParent && scrollParent !== document.body) {
      const overflowY = window.getComputedStyle(scrollParent).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        break;
      }
      scrollParent = scrollParent.parentElement;
    }

    const actualTarget =
      scrollParent && scrollParent !== document.body ? scrollParent : window;

    const handleScroll = () => {
      const currentScrollTop =
        actualTarget === window
          ? window.scrollY
          : (actualTarget as HTMLElement).scrollTop;

      setScrollY(currentScrollTop);
    };

    actualTarget.addEventListener("scroll", handleScroll);
    return () => actualTarget.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      ref={targetRef}
      className="min-h-full w-full bg-black text-white flex flex-col items-center justify-start relative"
    >
      <div className="h-dvh inset-0 h-screen flex flex-col items-center justify-center text-center z-[999] pointer-events-none">
        <h1>쓰로틀링이 무엇일까요?</h1>
        <p>ScrollY : {throttledScrollY} px</p>
      </div>
    </div>
  );
};

export default ThrottlePage;

/*
import { useEffect, useState } from "react";
import useThrottle from "../hooks/useThrottle";

const ThrottlePage = () => {
  const [scrollY, setScrollY] = useState<number>(0);

    

  const handleScroll = useThrottle(() => {
    setScrollY(window.scrollY);
  }, 2000);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  console.log("리랜더링");

  return (
    <div className="h-dvh flex flex-col items-center justify-center">
      <div>
        <h1>쓰로틀링이 무엇일까요?</h1>
        <p>ScrollY:{scrollY}px</p>
      </div>
    </div>
  );
};

export default ThrottlePage;

*/
