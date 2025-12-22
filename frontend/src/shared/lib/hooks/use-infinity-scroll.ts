import { useEffect, useRef } from "react";

export const useInfiniteScroll = (callback: () => void, enabled: boolean) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled || !ref.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback();
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [callback, enabled]);

  return ref;
};
