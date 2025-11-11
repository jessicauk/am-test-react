import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CharacterItem } from "../../types";

interface SelectedState {
  character: CharacterItem | null;
}

const initialState: SelectedState = {
  character: null,
};

const selectedSlice = createSlice({
  name: "selected",
  initialState,
  reducers: {
    setSelectedCharacter: (state, action: PayloadAction<CharacterItem>) => {
      state.character = action.payload;
    },
    clearSelectedCharacter: (state) => {
      state.character = null;
    },
  },
});

export const { setSelectedCharacter, clearSelectedCharacter } =
  selectedSlice.actions;
export default selectedSlice.reducer;
