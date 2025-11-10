import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Character } from '../../types';

interface FavoritesState {
  favorites: Character[];
}

// 🧠 Carga inicial desde localStorage
const loadFromLocalStorage = (): Character[] => {
  try {
    const data = localStorage.getItem('favorites');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const initialState: FavoritesState = {
  favorites: typeof window !== 'undefined' ? loadFromLocalStorage() : [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Character>) => {
      const exists = state.favorites.find(f => f.id === action.payload.id);
      if (!exists) {
        state.favorites.push(action.payload);
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(f => f.id !== action.payload);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    clearFavorites: (state) => {
      state.favorites = [];
      localStorage.removeItem('favorites');
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;