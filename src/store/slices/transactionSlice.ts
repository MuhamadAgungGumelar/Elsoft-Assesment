import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction, TransactionDetail, TransactionState } from '@/types/transaction';

const initialState: TransactionState = {
  transactions: [],
  selectedTransaction: null,
  details: [],
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactions(state, action: PayloadAction<Transaction[]>) {
      state.transactions = action.payload;
      state.loading = false;
    },
    setSelectedTransaction(state, action: PayloadAction<Transaction | null>) {
      state.selectedTransaction = action.payload;
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transactions.unshift(action.payload);
    },
    updateTransaction(state, action: PayloadAction<Transaction>) {
      const idx = state.transactions.findIndex((t) => t.Oid === action.payload.Oid);
      if (idx !== -1) state.transactions[idx] = action.payload;
      if (state.selectedTransaction?.Oid === action.payload.Oid) {
        state.selectedTransaction = action.payload;
      }
    },
    removeTransaction(state, action: PayloadAction<string>) {
      state.transactions = state.transactions.filter((t) => t.Oid !== action.payload);
    },
    setDetails(state, action: PayloadAction<TransactionDetail[]>) {
      state.details = action.payload;
    },
    addDetail(state, action: PayloadAction<TransactionDetail>) {
      state.details.push(action.payload);
    },
    updateDetail(state, action: PayloadAction<TransactionDetail>) {
      const idx = state.details.findIndex((d) => d.Oid === action.payload.Oid);
      if (idx !== -1) state.details[idx] = action.payload;
    },
    removeDetail(state, action: PayloadAction<string>) {
      state.details = state.details.filter((d) => d.Oid !== action.payload);
    },
    setTransactionLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setTransactionError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setTransactions,
  setSelectedTransaction,
  addTransaction,
  updateTransaction,
  removeTransaction,
  setDetails,
  addDetail,
  updateDetail,
  removeDetail,
  setTransactionLoading,
  setTransactionError,
} = transactionSlice.actions;
export default transactionSlice.reducer;
