import { AppDispatch } from '../index';
import {
  setItems,
  addItem,
  updateItem,
  removeItem,
  setItemLoading,
  setItemError,
} from '../slices/itemSlice';
import apiClient from '@/lib/axios';
import { ItemFormData } from '@/types/item';

export const fetchItemsThunk = () => async (dispatch: AppDispatch) => {
  dispatch(setItemLoading(true));
  try {
    const { data } = await apiClient.get('/items');
    dispatch(setItems(data.data || data || []));
  } catch (err: unknown) {
    dispatch(setItemError(extractError(err)));
  }
};

export const createItemThunk =
  (payload: ItemFormData) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiClient.post('/items', payload);
      dispatch(addItem(data.data || data));
      return { success: true };
    } catch (err: unknown) {
      const msg = extractError(err);
      dispatch(setItemError(msg));
      return { success: false, message: msg };
    }
  };

export const updateItemThunk =
  (id: string, payload: ItemFormData) => async (dispatch: AppDispatch) => {
    try {
      const { data } = await apiClient.put(`/items/${id}`, payload);
      dispatch(updateItem(data.data || data));
      return { success: true };
    } catch (err: unknown) {
      const msg = extractError(err);
      dispatch(setItemError(msg));
      return { success: false, message: msg };
    }
  };

export const deleteItemThunk = (id: string) => async (dispatch: AppDispatch) => {
  try {
    await apiClient.delete(`/items/${id}`);
    dispatch(removeItem(id));
    return { success: true };
  } catch (err: unknown) {
    const msg = extractError(err);
    dispatch(setItemError(msg));
    return { success: false, message: msg };
  }
};

function extractError(err: unknown): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    'Terjadi kesalahan.'
  );
}
