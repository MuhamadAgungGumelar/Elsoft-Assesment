import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Item, ItemState } from '@/types/item';

const initialState: ItemState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

const itemSlice = createSlice({
  name: 'item',
  initialState,
  reducers: {
    setItems(state, action: PayloadAction<Item[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    setSelectedItem(state, action: PayloadAction<Item | null>) {
      state.selectedItem = action.payload;
    },
    addItem(state, action: PayloadAction<Item>) {
      state.items.unshift(action.payload);
    },
    updateItem(state, action: PayloadAction<Item>) {
      const idx = state.items.findIndex((i) => i.Oid === action.payload.Oid);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.Oid !== action.payload);
    },
    setItemLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setItemError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setItems,
  setSelectedItem,
  addItem,
  updateItem,
  removeItem,
  setItemLoading,
  setItemError,
} = itemSlice.actions;
export default itemSlice.reducer;
