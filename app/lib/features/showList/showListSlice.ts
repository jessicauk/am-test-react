import { createSlice } from "@reduxjs/toolkit";

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
      state.show = !state.show;
      localStorage.setItem('show', JSON.stringify(state.show));
    },
    
  },
});

export const { showList } =
  showListSlice.actions;
export default showListSlice.reducer;
