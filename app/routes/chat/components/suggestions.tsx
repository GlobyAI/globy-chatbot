
import { useHorizontalScroll } from '~/hooks/useHorizontalScroll';


export default function Suggestions() {
    const scrollRef = useHorizontalScroll();
    return (
        <div className="suggestions">
            <p className="suggestions__label">Here are some prompt suggestions for you:</p>
            <div className="suggestions__container">
                <div className="suggestions__container-slider" ref={scrollRef}>
                    <p className="suggestions-items">
                        I also missed the "s":( and that was the issue. In many places people write that you should check only parent not all parents. I found my issue by checking if calling</p>
                    <p className="suggestions-items">
                        I also missed the "s":( and that was the issue. In many places people write that you should check only parent not all parents. I found my issue by checking if calling</p>
                    <p className="suggestions-items">
                        I also missed the "s":( and that was the issue. In many places people write that you should check only parent not all parents. I found my issue by checking if calling</p>
                </div>
            </div>
        </div>
    )
}