import React from 'react'
import { useHorizontalScrollWithPagination } from '~/hooks/useHorizontalScroll';
import ArrowRight from '/icons/keyboard-arrow-right.svg'
type Props = {
    children: React.ReactNode
    data: any
}

export default function Slider({ children, data }: Props) {
    const { elRef, isAtEnd, isAtStart, isScrollable } = useHorizontalScrollWithPagination(data);
    function scrollSlider(
        container: HTMLDivElement | null,
        direction: 'left' | 'right',
    ) {
        if (!container) return;
        const parent = container.parentElement
        const parentWidth = parent?.clientWidth || 200
        const amount = parentWidth / 2
        const scrollAmount = direction === 'left' ? -amount : amount;
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }

    const isAtMiddle = !isAtEnd && !isAtStart
    return (
        <div className="slider">
            {
                isScrollable && (isAtMiddle || isAtEnd) &&
                <div className="slider__pagination left">
                    <figure className='pagination-icon' onClick={() => scrollSlider(elRef.current, 'left')}>
                        <img src={ArrowRight} />
                    </figure>
                </div>
            }
            <div className="slider__container" ref={elRef}>
                {
                    children
                }
            </div>
            {
                isScrollable && (isAtMiddle || isAtStart) &&
                <div className="slider__pagination right" onClick={() => scrollSlider(elRef.current, 'right')}>
                    <figure className='pagination-icon'>
                        <img src={ArrowRight} />
                    </figure>
                </div>
            }
        </div>
    )
}