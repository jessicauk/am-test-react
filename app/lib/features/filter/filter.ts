import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  text: string;
}

const initialState: FilterState = {
  text: "",
};

const filterTexttSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilterText: (state, action: PayloadAction<string>) => {
        state.text = action.payload;
        localStorage.setItem('filter', JSON.stringify(state.text));
    },
    
  },
});

export const { setFilterText } =
  filterTexttSlice.actions;
export default filterTexttSlice.reducer;
