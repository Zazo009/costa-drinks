'use client';

import { useState } from 'react';
import Image from 'next/image';
import ProductArt from './product-art/ProductArt';
import type { Product } from '@/data/products';

export default function ProductThumbnail({
  category,
  image,
  alt,
  bgClass,
  artColor,
  artLabel,
}: {
  category: Product['category'];
  image: string;
  alt: string;
  bgClass: string;
  artColor: string;
  artLabel: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <ProductArt category={category} bgClass={bgClass} artColor={artColor} artLabel={artLabel} />;
  }

  return (
    <div className="relative aspect-square overflow-hidden bg-cream">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, 25vw"
        className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.05]"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
