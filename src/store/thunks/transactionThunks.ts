import { AppDispatch, RootState } from '../index';
import {
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
} from '../slices/transactionSlice';
import apiClient from '@/lib/axios';
import { TransactionFormData, TransactionDetailFormData } from '@/types/transaction';

export const fetchTransactionsThunk = () => async (dispatch: AppDispatch) => {
  dispatch(setTransactionLoading(true));
  try {
    const { data } = await apiClient.get('/transactions');
    dispatch(setTransactions(data.data || data || []));
  } catch (err: unknown) {
    dispatch(setTransactionError(extractError(err)));
  }
};

export const fetchTransactionThunk =
  (id: string) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(setTransactionLoading(true));
    try {
      const { data } = await apiClient.get(`/transactions/${id}`);
      dispatch(setSelectedTransaction(data.data || data));
      const incomingDetails = data.details;
      // Jangan wipe details yang sudah ada kalau API return kosong/undefined
      if (Array.isArray(incomingDetails) && incomingDetails.length > 0) {
        dispatch(setDetails(incomingDetails));
      } else if (Array.isArray(incomingDetails) && incomingDetails.length === 0) {
        const existing = getState().transaction.details;
        if (existing.length === 0) dispatch(setDetails([]));
      }
      dispatch(setTransactionLoading(false));
    } catch (err: unknown) {
    dispatch(setTransactionError(extractError(err)));
  }
};

export const createTransactionThunk =
  (payload: TransactionFormData) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiClient.post('/transactions', payload);
      dispatch(addTransaction(data.data || data));
      return { success: true, data: data.data || data };
    } catch (err: unknown) {
      const msg = extractError(err);
      dispatch(setTransactionError(msg));
      return { success: false, message: msg };
    }
  };

export const updateTransactionThunk =
  (id: string, payload: TransactionFormData) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiClient.put(`/transactions/${id}`, payload);
      dispatch(updateTransaction(data.data || data));
      return { success: true };
    } catch (err: unknown) {
      const msg = extractError(err);
      dispatch(setTransactionError(msg));
      return { success: false, message: msg };
    }
  };

export const deleteTransactionThunk = (id: string) => async (dispatch: AppDispatch) => {
  try {
    await apiClient.delete(`/transactions/${id}`);
    dispatch(removeTransaction(id));
    return { success: true };
  } catch (err: unknown) {
    const msg = extractError(err);
    dispatch(setTransactionError(msg));
    return { success: false, message: msg };
  }
};

export const createDetailThunk =
  (txId: string, payload: TransactionDetailFormData) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiClient.post(`/transactions/${txId}/detail`, payload);
      dispatch(addDetail(data.data || data));
      return { success: true };
    } catch (err: unknown) {
      const msg = extractError(err);
      dispatch(setTransactionError(msg));
      return { success: false, message: msg };
    }
  };

export const updateDetailThunk =
  (txId: string, detailId: string, payload: TransactionDetailFormData) =>
  async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiClient.put(
        `/transactions/${txId}/detail/${detailId}`,
        payload
      );
      dispatch(updateDetail(data.data || data));
      return { success: true };
    } catch (err: unknown) {
      const msg = extractError(err);
      dispatch(setTransactionError(msg));
      return { success: false, message: msg };
    }
  };

export const deleteDetailThunk =
  (txId: string, detailId: string) => async (dispatch: AppDispatch) => {
    try {
      await apiClient.delete(`/transactions/${txId}/detail/${detailId}`);
      dispatch(removeDetail(detailId));
      return { success: true };
    } catch (err: unknown) {
      const msg = extractError(err);
      dispatch(setTransactionError(msg));
      return { success: false, message: msg };
    }
  };

function extractError(err: unknown): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    'Terjadi kesalahan.'
  );
}
