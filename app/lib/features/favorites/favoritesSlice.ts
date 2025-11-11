import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CharacterItem } from '../../types';

interface FavoritesState {
  favorites: CharacterItem[];
  isHydrated: boolean;
}

const initialState: FavoritesState = {
  favorites: [],
  isHydrated: false,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    hydrateFavorites: (state) => {
      if (typeof window !== 'undefined' && !state.isHydrated) {
        try {
          const data = localStorage.getItem('favorites');
          state.favorites = data ? JSON.parse(data) : [];
        } catch {
          state.favorites = [];
        }
        state.isHydrated = true;
      }
    },
    addFavorites: (state, action: PayloadAction<CharacterItem[]>) => {
      state.favorites.push(...action.payload);
      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    clearFavorites: (state) => {
      state.favorites = [];
      if (typeof window !== 'undefined') {
        localStorage.removeItem('favorites');
      }
    },
    addFavorite: (state, action: PayloadAction<CharacterItem>) => {
      const index = state.favorites.findIndex(f => f.id === action.payload.id);

      if (index !== -1) {
        // Actualiza solo isFavorite, manteniendo el resto del objeto
        state.favorites[index].isFavorite = !action.payload.isFavorite;
      } else {
        // Agrega el personaje completo si no existe
        state.favorites.push({
          ...action.payload,
          isFavorite: action.payload.isFavorite,
        });
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
  },
});

export const { addFavorite, clearFavorites, addFavorites, hydrateFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;