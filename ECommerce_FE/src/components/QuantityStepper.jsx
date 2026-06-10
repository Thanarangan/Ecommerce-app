import { Minus, Plus } from 'lucide-react'

export function QuantityStepper({ max = 99, min = 1, onChange, value }) {
  const decrease = () => onChange(Math.max(min, value - 1))
  const increase = () => onChange(Math.min(max, value + 1))

  return (
    <div className="quantity-stepper" aria-label="Quantity selector">
      <button
        aria-label="Decrease quantity"
        disabled={value <= min}
        type="button"
        onClick={decrease}
      >
        <Minus size={16} />
      </button>
      <input
        aria-label="Quantity"
        min={min}
        max={max}
        type="number"
        value={value}
        onChange={(event) => {
          const nextValue = Number.parseInt(event.target.value, 10)
          onChange(Number.isNaN(nextValue) ? min : Math.min(max, Math.max(min, nextValue)))
        }}
      />
      <button
        aria-label="Increase quantity"
        disabled={value >= max}
        type="button"
        onClick={increase}
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
