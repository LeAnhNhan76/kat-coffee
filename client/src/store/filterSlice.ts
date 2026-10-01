import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  categoryId: string | null;
  searchTerm: string;
  minPrice: string;
  maxPrice: string;
  availableOnly: boolean;
  page: number;
}

const initialState: FilterState = {
  categoryId: null,
  searchTerm: '',
  minPrice: '',
  maxPrice: '',
  availableOnly: false,
  page: 1,
};

export const getValidPriceRange = (
  minValue: string,
  maxValue: string,
): { minPrice: number | null; maxPrice: number | null } | null => {
  const minPrice = minValue === '' ? null : Number(minValue);
  const maxPrice = maxValue === '' ? null : Number(maxValue);
  const hasValidMin =
    minPrice === null || (Number.isFinite(minPrice) && minPrice >= 0);
  const hasValidMax =
    maxPrice === null || (Number.isFinite(maxPrice) && maxPrice >= 0);
  const hasValidOrder =
    minPrice === null || maxPrice === null || minPrice <= maxPrice;

  return hasValidMin && hasValidMax && hasValidOrder
    ? { minPrice, maxPrice }
    : null;
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
    setMinPrice: (state, action: PayloadAction<string>) => {
      state.minPrice = action.payload;
      state.page = 1;
    },
    setMaxPrice: (state, action: PayloadAction<string>) => {
      state.maxPrice = action.payload;
      state.page = 1;
    },
    setAvailableOnly: (state, action: PayloadAction<boolean>) => {
      state.availableOnly = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const {
  setCategory,
  setSearchTerm,
  setMinPrice,
  setMaxPrice,
  setAvailableOnly,
  setPage,
} = filterSlice.actions;
export default filterSlice.reducer;