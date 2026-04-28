import itemReducer, {
  setItems,
  setSelectedItem,
  addItem,
  updateItem,
  removeItem,
  setItemLoading,
  setItemError,
} from '@/store/slices/itemSlice';
import type { ItemState, Item } from '@/types/item';

const mockItem: Item = {
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

const mockItem2: Item = {
  Oid: 'item-2',
  Code: 'ITEM-002',
  Label: 'Item B',
  ItemType: 'type-1',
  ItemGroup: 'group-1',
  ItemAccountGroup: 'acg-1',
  ItemUnit: 'unit-1',
  ItemUnitName: 'PCS',
  IsActive: false,
};

const initialState: ItemState = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
};

describe('itemSlice', () => {
  it('returns initial state', () => {
    expect(itemReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('setItems', () => {
    it('replaces items array and stops loading', () => {
      const state = itemReducer(
        { ...initialState, loading: true },
        setItems([mockItem, mockItem2])
      );
      expect(state.items).toHaveLength(2);
      expect(state.items[0].Oid).toBe('item-1');
      expect(state.loading).toBe(false);
    });
  });

  describe('setSelectedItem', () => {
    it('sets selected item', () => {
      const state = itemReducer(initialState, setSelectedItem(mockItem));
      expect(state.selectedItem).toEqual(mockItem);
    });

    it('clears selected item when null', () => {
      const state = itemReducer(
        { ...initialState, selectedItem: mockItem },
        setSelectedItem(null)
      );
      expect(state.selectedItem).toBeNull();
    });
  });

  describe('addItem', () => {
    it('prepends new item to the list', () => {
      const state = itemReducer(
        { ...initialState, items: [mockItem2] },
        addItem(mockItem)
      );
      expect(state.items).toHaveLength(2);
      expect(state.items[0].Oid).toBe('item-1');
    });
  });

  describe('updateItem', () => {
    it('updates existing item in place', () => {
      const updated: Item = { ...mockItem, Label: 'Item A Updated' };
      const state = itemReducer(
        { ...initialState, items: [mockItem, mockItem2] },
        updateItem(updated)
      );
      expect(state.items[0].Label).toBe('Item A Updated');
      expect(state.items[1].Label).toBe('Item B');
    });

    it('does nothing if Oid not found', () => {
      const ghost: Item = { ...mockItem, Oid: 'item-999' };
      const state = itemReducer(
        { ...initialState, items: [mockItem] },
        updateItem(ghost)
      );
      expect(state.items[0].Label).toBe('Item A');
    });
  });

  describe('removeItem', () => {
    it('removes item by Oid', () => {
      const state = itemReducer(
        { ...initialState, items: [mockItem, mockItem2] },
        removeItem('item-1')
      );
      expect(state.items).toHaveLength(1);
      expect(state.items[0].Oid).toBe('item-2');
    });

    it('leaves list unchanged if Oid not found', () => {
      const state = itemReducer(
        { ...initialState, items: [mockItem] },
        removeItem('item-999')
      );
      expect(state.items).toHaveLength(1);
    });
  });

  describe('setItemLoading', () => {
    it('sets loading flag', () => {
      const state = itemReducer(initialState, setItemLoading(true));
      expect(state.loading).toBe(true);
    });
  });

  describe('setItemError', () => {
    it('sets error and stops loading', () => {
      const state = itemReducer(
        { ...initialState, loading: true },
        setItemError('Gagal memuat.')
      );
      expect(state.error).toBe('Gagal memuat.');
      expect(state.loading).toBe(false);
    });

    it('clears error when null', () => {
      const state = itemReducer(
        { ...initialState, error: 'old error' },
        setItemError(null)
      );
      expect(state.error).toBeNull();
    });
  });
});
