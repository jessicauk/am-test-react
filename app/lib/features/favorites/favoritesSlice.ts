import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CharacterItem } from '../../types';

interface FavoritesState {
  favorites: CharacterItem[];
}

// Carga inicial desde localStorage
const loadFromLocalStorage = (): CharacterItem[] => {
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
    addFavorites: (state, action: PayloadAction<CharacterItem[]>) => {
        state.favorites.push(...action.payload);
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      
    },
    clearFavorites: (state) => {
      state.favorites = [];
      localStorage.removeItem('favorites');
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

      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
  },
});

export const { addFavorite, clearFavorites, addFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;