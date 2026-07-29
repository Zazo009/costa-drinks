export default function SpiritsBottle({ bodyColor, labelText }: { bodyColor: string; labelText: string }) {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full">
      <ellipse cx="100" cy="182" rx="38" ry="6" fill="#000" opacity="0.06" />
      <rect x="88" y="18" width="24" height="14" rx="2" fill="#2b2b2b" />
      <path
        d="M90 32 H110 V54 C110 60 124 64 124 82 V172 C124 179 118 184 111 184 H89 C82 184 76 179 76 172 V82 C76 64 90 60 90 54 Z"
        fill={bodyColor}
      />
      <rect x="72" y="96" width="56" height="52" rx="3" fill="#fdfaf4" opacity="0.96" />
      <text
        x="100"
        y="118"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fill="#3a3a3a"
        style={{ fontFamily: 'sans-serif' }}
      >
        {labelText}
      </text>
      <line x1="82" y1="128" x2="118" y2="128" stroke="#c9b98a" strokeWidth="1.5" />
      <text x="100" y="140" textAnchor="middle" fontSize="8" fill="#8a8a8a" style={{ fontFamily: 'sans-serif' }}>
        700ml
      </text>
      <ellipse cx="84" cy="70" rx="5" ry="16" fill="#fff" opacity="0.2" />
    </svg>
  );
}
