import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  categoryId: string | null;
  searchTerm: string;
  page: number;
}

const initialState: FilterState = {
  categoryId: null,
  searchTerm: '',
  page: 1,
};

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setCategory: (state, action: PayloadAction<string | null>) => {
      state.categoryId = action.payload;
      state.page = 1;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const { setCategory, setSearchTerm, setPage } = filterSlice.actions;
export default filterSlice.reducer;