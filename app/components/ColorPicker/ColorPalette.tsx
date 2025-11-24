import { Fragment } from 'react'

type Props = {
    selectedColors: string[]
    activeColorIndex: number
    maxColors: number
    buttonRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>
    onSelectColor: (index: number) => void
    onRemoveColor: (index: number, e: React.MouseEvent) => void
    onAddColor: () => void
}

export default function ColorPalette({
    selectedColors,
    activeColorIndex,
    maxColors,
    buttonRefs,
    onSelectColor,
    onRemoveColor,
    onAddColor
}: Props) {
    return (
        <div className="color-palette">
            {selectedColors.length < maxColors && (
                <button
                    type="button"
                    className="add-color-btn"
                    onClick={onAddColor}
                    aria-label="Add color"
                >
                    + Add Color
                </button>
            )}
            {selectedColors.map((color, index) => (
                <div key={index} className="color-palette-item">
                    <button
                        ref={el => { buttonRefs.current[index] = el }} 
                        type="button"
                        className={`globy-color-picker ${activeColorIndex === index ? 'active' : ''}`}
                        onClick={() => onSelectColor(index)}
                        style={{ background: color }}
                        aria-label={`Select color ${index + 1}`}
                    />
                    <span className="color-text">{color}</span>
                    {selectedColors.length > 1 && (
                        <button
                            type="button"
                            className="remove-color-btn"
                            onClick={(e) => onRemoveColor(index, e)}
                            aria-label="Remove color"
                        >
                            ×
                        </button>
                    )}
                </div>
            ))}
        </div>
    )
}