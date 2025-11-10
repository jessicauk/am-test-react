import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Character } from "../../types";

interface SelectedState {
  character: Character | null;
}

const initialState: SelectedState = {
  character: null,
};

const selectedSlice = createSlice({
  name: "selected",
  initialState,
  reducers: {
    setSelectedCharacter: (state, action: PayloadAction<Character>) => {
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
