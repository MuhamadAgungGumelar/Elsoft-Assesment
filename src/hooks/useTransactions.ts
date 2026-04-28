'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setSelectedTransaction } from '@/store/slices/transactionSlice';
import {
  fetchTransactionsThunk,
  fetchTransactionThunk,
  createTransactionThunk,
  updateTransactionThunk,
  deleteTransactionThunk,
  createDetailThunk,
  updateDetailThunk,
  deleteDetailThunk,
} from '@/store/thunks/transactionThunks';
import { TransactionFormData, TransactionDetailFormData } from '@/types/transaction';

export function useTransactions() {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, selectedTransaction, details, loading, error } = useSelector(
    (state: RootState) => state.transaction
  );

  const fetchAll = () => dispatch(fetchTransactionsThunk());
  const fetchOne = (id: string) => dispatch(fetchTransactionThunk(id));
  const select = (tx: typeof selectedTransaction) => dispatch(setSelectedTransaction(tx));
  const create = (data: TransactionFormData) => dispatch(createTransactionThunk(data));
  const update = (id: string, data: TransactionFormData) =>
    dispatch(updateTransactionThunk(id, data));
  const remove = (id: string) => dispatch(deleteTransactionThunk(id));

  const createDetail = (txId: string, data: TransactionDetailFormData) =>
    dispatch(createDetailThunk(txId, data));
  const updateDetail = (txId: string, detailId: string, data: TransactionDetailFormData) =>
    dispatch(updateDetailThunk(txId, detailId, data));
  const removeDetail = (txId: string, detailId: string) =>
    dispatch(deleteDetailThunk(txId, detailId));

  return {
    transactions,
    selectedTransaction,
    details,
    loading,
    error,
    fetchAll,
    fetchOne,
    select,
    create,
    update,
    remove,
    createDetail,
    updateDetail,
    removeDetail,
  };
}
