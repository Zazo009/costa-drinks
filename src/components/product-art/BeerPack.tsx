function BeerBottle({ x, bodyColor }: { x: number; bodyColor: string }) {
  return (
    <g transform={`translate(${x}, 0)`}>
      <rect x="8" y="10" width="8" height="16" rx="2" fill={bodyColor} />
      <path
        d="M6 26 H18 C20 26 21 28 21 30 V88 C21 94 18 98 12 98 C6 98 3 94 3 88 V30 C3 28 4 26 6 26 Z"
        fill={bodyColor}
      />
      <rect x="2" y="52" width="20" height="26" rx="1.5" fill="#fdfaf4" opacity="0.95" />
    </g>
  );
}

export default function BeerPack({ bodyColor, labelText }: { bodyColor: string; labelText: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <ellipse cx="100" cy="192" rx="60" ry="5" fill="#000" opacity="0.06" />
      <g transform="translate(38, 60)">
        <BeerBottle x={0} bodyColor={bodyColor} />
        <BeerBottle x={30} bodyColor={bodyColor} />
        <BeerBottle x={60} bodyColor={bodyColor} />
        <BeerBottle x={90} bodyColor={bodyColor} />
      </g>
      <text
        x="100"
        y="182"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="#3a3a3a"
        style={{ fontFamily: 'sans-serif' }}
      >
        {labelText}
      </text>
    </svg>
  );
}
