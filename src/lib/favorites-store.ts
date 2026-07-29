import { create } from 'zustand';

type FavoritesState = {
  ids: Set<string>;
  loaded: boolean;
  load: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  ids: new Set(),
  loaded: false,
  load: async () => {
    const res = await fetch('/api/favorites');
    const data = await res.json();
    set({ ids: new Set(data.favorites as string[]), loaded: true });
  },
  toggle: async (productId: string) => {
    const current = get().ids;
    const isFavorited = current.has(productId);
    const next = new Set(current);
    if (isFavorited) {
      next.delete(productId);
    } else {
      next.add(productId);
    }
    set({ ids: next });

    const res = await fetch('/api/favorites', {
      method: isFavorited ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId }),
    });

    if (res.status === 401) {
      // Revert optimistic update; caller handles redirecting to login.
      set({ ids: current });
      throw new Error('unauthenticated');
    }
  },
}));
