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
    <div className="flex items-center rounded-lg border border-gray-200">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(quantity - 1)}
        disabled={quantity <= min}
        className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm font-medium text-gray-900">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
        className="flex h-8 w-8 items-center justify-center text-gray-500 hover:text-gray-900"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
