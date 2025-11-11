import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Character } from "../../types";

interface SelectedState {
  show: boolean;
}

const initialState: SelectedState = {
  show: false,
};

const showListSlice = createSlice({
  name: "showList",
  initialState,
  reducers: {
    showList: (state) => {
      state.show = true;
    },
    hideList: (state) => {
      state.show = false;
    },
  },
});

export const { showList, hideList } =
  showListSlice.actions;
export default showListSlice.reducer;
