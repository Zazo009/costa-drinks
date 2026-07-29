export default function WineBottle({ bodyColor, labelText }: { bodyColor: string; labelText: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <ellipse cx="100" cy="182" rx="34" ry="6" fill="#000" opacity="0.06" />
      <path
        d="M92 20 H108 V50 C108 58 116 62 122 72 C130 84 132 96 132 112 V172 C132 179 126 184 119 184 H81 C74 184 68 179 68 172 V112 C68 96 70 84 78 72 C84 62 92 58 92 50 Z"
        fill={bodyColor}
      />
      <rect x="90" y="16" width="20" height="10" rx="2" fill={bodyColor} />
      <path d="M90 16 H110 V22 H90 Z" fill="#3a3a3a" />
      <rect x="70" y="120" width="60" height="42" rx="3" fill="#fdfaf4" opacity="0.95" />
      <text
        x="100"
        y="138"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="#3a3a3a"
        style={{ fontFamily: 'sans-serif' }}
      >
        {labelText}
      </text>
      <line x1="80" y1="148" x2="120" y2="148" stroke="#c9b98a" strokeWidth="1.5" />
      <ellipse cx="88" cy="60" rx="6" ry="14" fill="#fff" opacity="0.18" />
    </svg>
  );
}
