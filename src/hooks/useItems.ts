'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setSelectedItem } from '@/store/slices/itemSlice';
import {
  fetchItemsThunk,
  createItemThunk,
  updateItemThunk,
  deleteItemThunk,
} from '@/store/thunks/itemThunks';
import { ItemFormData } from '@/types/item';
import { useEffect } from 'react';

export function useItems() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, selectedItem, loading, error } = useSelector(
    (state: RootState) => state.item
  );

  useEffect(() => {
    dispatch(fetchItemsThunk());
  }, [dispatch]);

  const refetch = () => dispatch(fetchItemsThunk());
  const select = (item: (typeof items)[0] | null) => dispatch(setSelectedItem(item));
  const create = (data: ItemFormData) => dispatch(createItemThunk(data));
  const update = (id: string, data: ItemFormData) => dispatch(updateItemThunk(id, data));
  const remove = (id: string) => dispatch(deleteItemThunk(id));

  return { items, selectedItem, loading, error, refetch, select, create, update, remove };
}
