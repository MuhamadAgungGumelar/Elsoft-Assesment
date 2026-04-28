import { configureStore } from '@reduxjs/toolkit';
import itemReducer from '@/store/slices/itemSlice';
import {
  fetchItemsThunk,
  createItemThunk,
  deleteItemThunk,
} from '@/store/thunks/itemThunks';
import apiClient from '@/lib/axios';

jest.mock('@/lib/axios');
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

function makeStore() {
  return configureStore({ reducer: { item: itemReducer } });
}

const mockItem = {
  Oid: 'item-1',
  Code: 'ITEM-001',
  Label: 'Item A',
  ItemType: 'type-1',
  ItemGroup: 'group-1',
  ItemAccountGroup: 'acg-1',
  ItemUnit: 'unit-1',
  ItemUnitName: 'PCS',
  IsActive: true,
};

describe('itemThunks', () => {
  afterEach(() => jest.clearAllMocks());

  describe('fetchItemsThunk', () => {
    it('dispatches setItems on success', async () => {
      mockApiClient.get = jest.fn().mockResolvedValue({ data: { data: [mockItem] } });
      const store = makeStore();
      await store.dispatch(fetchItemsThunk());
      expect(store.getState().item.items).toHaveLength(1);
      expect(store.getState().item.items[0].Oid).toBe('item-1');
      expect(store.getState().item.loading).toBe(false);
    });

    it('dispatches setItemError on failure', async () => {
      mockApiClient.get = jest.fn().mockRejectedValue({
        response: { data: { message: 'Unauthorized' } },
      });
      const store = makeStore();
      await store.dispatch(fetchItemsThunk());
      expect(store.getState().item.error).toBe('Unauthorized');
      expect(store.getState().item.items).toHaveLength(0);
    });
  });

  describe('createItemThunk', () => {
    it('prepends new item on success', async () => {
      mockApiClient.post = jest.fn().mockResolvedValue({ data: { data: mockItem } });
      const store = makeStore();
      const result = await store.dispatch(createItemThunk({ Label: 'Item A', IsActive: 'true' }));
      expect(result.success).toBe(true);
      expect(store.getState().item.items[0].Oid).toBe('item-1');
    });

    it('returns error message on failure', async () => {
      mockApiClient.post = jest.fn().mockRejectedValue({
        response: { data: { message: 'Validation error' } },
      });
      const store = makeStore();
      const result = await store.dispatch(createItemThunk({ Label: '', IsActive: 'true' }));
      expect(result.success).toBe(false);
      expect(result.message).toBe('Validation error');
    });
  });

  describe('deleteItemThunk', () => {
    it('removes item from store on success', async () => {
      mockApiClient.delete = jest.fn().mockResolvedValue({ data: { success: true } });
      const store = configureStore({
        reducer: { item: itemReducer },
        preloadedState: { item: { items: [mockItem], selectedItem: null, loading: false, error: null } },
      });
      const result = await store.dispatch(deleteItemThunk('item-1'));
      expect(result.success).toBe(true);
      expect(store.getState().item.items).toHaveLength(0);
    });

    it('sets error on failure', async () => {
      mockApiClient.delete = jest.fn().mockRejectedValue({
        response: { data: { message: 'Item not found' } },
      });
      const store = makeStore();
      const result = await store.dispatch(deleteItemThunk('item-999'));
      expect(result.success).toBe(false);
      expect(store.getState().item.error).toBe('Item not found');
    });
  });
});
