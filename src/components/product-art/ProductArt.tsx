import WineBottle from './WineBottle';
import BeerPack from './BeerPack';
import SpiritsBottle from './SpiritsBottle';
import type { Product } from '@/data/products';

export default function ProductArt({
  category,
  bgClass,
  artColor,
  artLabel,
}: {
  category: Product['category'];
  bgClass: string;
  artColor: string;
  artLabel: string;
}) {
  const Art =
    category === 'wine' || category === 'cava'
      ? WineBottle
      : category === 'beer'
        ? BeerPack
        : SpiritsBottle;

  return (
    <div className={`flex aspect-square items-center justify-center rounded-xl ${bgClass} p-4 transition-transform duration-300 group-hover:scale-[1.02]`}>
      <div className="h-full w-full max-w-[160px]">
        <Art bodyColor={artColor} labelText={artLabel} />
      </div>
    </div>
  );
}
