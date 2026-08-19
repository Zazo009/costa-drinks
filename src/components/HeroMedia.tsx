'use client';

import { useEffect, useState } from 'react';

const FILTER = 'saturate(.85) contrast(1.05)';

/**
 * Poster is always painted (mobile LCP + fallback). The video element is
 * only mounted client-side on wide, motion-safe, non-data-saver viewports —
 * `autoplay` makes browsers fetch the source even while `display:none`, so
 * CSS alone can't keep a 2MB video off a phone connection.
 */
export default function HeroMedia() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const query = window.matchMedia('(min-width: 768px)');
    const sync = () => setShowVideo(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
      <img
        src="/hero-poster.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: FILTER }}
      />
      {showVideo && (
        <video
          src="/hero-bg.mp4"
          poster="/hero-poster.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: FILTER }}
        />
      )}
    </div>
  );
}
