import { configureStore } from '@reduxjs/toolkit'
import favoritesReducer from './features/favorites/favoritesSlice'
import selectedReducer from './features/selected/selectedSlice'
import showListReducer from './features/showList/showListSlice'
import filterReducer from './features/filter/filter'

export const makeStore = () => {
  return configureStore({
    reducer: {
        // Add your slices here
        favorites: favoritesReducer,
        selected: selectedReducer,
        showList: showListReducer,
        filter: filterReducer,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']