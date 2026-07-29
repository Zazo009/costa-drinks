'use client';

import { Minus, Plus } from 'lucide-react';

export default function QuantityStepper({
  quantity,
  onChange,
  min = 1,
}: {
  quantity: number;
  onChange: (next: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center rounded-lg border border-ink/10">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= min}
        className="flex h-8 w-8 items-center justify-center text-ink/50 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm font-medium text-ink">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
        className="flex h-8 w-8 items-center justify-center text-ink/50 hover:text-ink"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
