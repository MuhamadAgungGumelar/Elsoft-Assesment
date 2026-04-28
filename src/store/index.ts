import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import itemReducer from './slices/itemSlice';
import transactionReducer from './slices/transactionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    item: itemReducer,
    transaction: transactionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
