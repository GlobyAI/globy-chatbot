import { useRef, useEffect, useState } from 'react';

export function useHorizontalScrollWithPagination({ data }: { data: any }) {
  const elRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(true);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;

      const scrollable = scrollWidth > clientWidth;
      setIsScrollable(scrollable);

      if (!scrollable) {
        setIsAtStart(true);
        setIsAtEnd(true);
        return;
      }
      console.log(scrollLeft,clientWidth,scrollWidth)
      setIsAtStart(scrollLeft <= 20);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
      updateScrollState();
    };

    const onScroll = () => updateScrollState();

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('scroll', onScroll);

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(el);

    const mutationObserver = new MutationObserver(() => {
      requestAnimationFrame(updateScrollState);
    });
    mutationObserver.observe(el, { childList: true, subtree: true });

    // Trigger initial update after data changes
    requestAnimationFrame(() => {
      el.scrollLeft = 0;
      updateScrollState();
    });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('scroll', onScroll);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [data]);

  return { elRef, isAtStart, isAtEnd, isScrollable };
}