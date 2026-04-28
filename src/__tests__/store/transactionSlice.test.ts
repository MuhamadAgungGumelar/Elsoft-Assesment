import transactionReducer, {
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
} from '@/store/slices/transactionSlice';
import type { TransactionState, Transaction, TransactionDetail } from '@/types/transaction';

const mockTx: Transaction = {
  Oid: 'tx-1',
  Company: 'company-1',
  CompanyName: 'testcase',
  Code: '1228UITM',
  Date: '2023-12-28',
  Account: 'account-1',
  AccountName: 'Biaya Adm Bank',
  Status: 'status-1',
  StatusName: 'Entry',
  Note: null,
};

const mockTx2: Transaction = { ...mockTx, Oid: 'tx-2', Code: '1228UITA' };

const mockDetail: TransactionDetail = {
  Oid: 'detail-1',
  index: 1,
  Item: 'item-1',
  ItemName: 'Item A',
  Quantity: '2',
  ItemUnit: 'unit-1',
  ItemUnitName: 'PCS',
  Note: null,
};

const mockDetail2: TransactionDetail = { ...mockDetail, Oid: 'detail-2', ItemName: 'Item B' };

const initialState: TransactionState = {
  transactions: [],
  selectedTransaction: null,
  details: [],
  loading: false,
  error: null,
};

describe('transactionSlice', () => {
  it('returns initial state', () => {
    expect(transactionReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('setTransactions', () => {
    it('replaces transactions and stops loading', () => {
      const state = transactionReducer(
        { ...initialState, loading: true },
        setTransactions([mockTx, mockTx2])
      );
      expect(state.transactions).toHaveLength(2);
      expect(state.loading).toBe(false);
    });
  });

  describe('setSelectedTransaction', () => {
    it('sets selectedTransaction', () => {
      const state = transactionReducer(initialState, setSelectedTransaction(mockTx));
      expect(state.selectedTransaction?.Oid).toBe('tx-1');
    });

    it('clears selectedTransaction', () => {
      const state = transactionReducer(
        { ...initialState, selectedTransaction: mockTx },
        setSelectedTransaction(null)
      );
      expect(state.selectedTransaction).toBeNull();
    });
  });

  describe('addTransaction', () => {
    it('prepends transaction to list', () => {
      const state = transactionReducer(
        { ...initialState, transactions: [mockTx2] },
        addTransaction(mockTx)
      );
      expect(state.transactions[0].Oid).toBe('tx-1');
      expect(state.transactions).toHaveLength(2);
    });
  });

  describe('updateTransaction', () => {
    it('updates transaction in list', () => {
      const updated = { ...mockTx, Code: 'UPDATED-CODE' };
      const state = transactionReducer(
        { ...initialState, transactions: [mockTx], selectedTransaction: mockTx },
        updateTransaction(updated)
      );
      expect(state.transactions[0].Code).toBe('UPDATED-CODE');
      expect(state.selectedTransaction?.Code).toBe('UPDATED-CODE');
    });

    it('also updates selectedTransaction if Oid matches', () => {
      const updated = { ...mockTx, Note: 'Updated note' };
      const state = transactionReducer(
        { ...initialState, transactions: [mockTx], selectedTransaction: mockTx },
        updateTransaction(updated)
      );
      expect(state.selectedTransaction?.Note).toBe('Updated note');
    });
  });

  describe('removeTransaction', () => {
    it('removes transaction by Oid', () => {
      const state = transactionReducer(
        { ...initialState, transactions: [mockTx, mockTx2] },
        removeTransaction('tx-1')
      );
      expect(state.transactions).toHaveLength(1);
      expect(state.transactions[0].Oid).toBe('tx-2');
    });
  });

  describe('setDetails', () => {
    it('sets details array', () => {
      const state = transactionReducer(initialState, setDetails([mockDetail, mockDetail2]));
      expect(state.details).toHaveLength(2);
    });
  });

  describe('addDetail', () => {
    it('appends detail to list', () => {
      const state = transactionReducer(
        { ...initialState, details: [mockDetail] },
        addDetail(mockDetail2)
      );
      expect(state.details).toHaveLength(2);
      expect(state.details[1].Oid).toBe('detail-2');
    });
  });

  describe('updateDetail', () => {
    it('updates detail in place', () => {
      const updated = { ...mockDetail, Quantity: '5' };
      const state = transactionReducer(
        { ...initialState, details: [mockDetail, mockDetail2] },
        updateDetail(updated)
      );
      expect(state.details[0].Quantity).toBe('5');
      expect(state.details[1].Quantity).toBe('2');
    });
  });

  describe('removeDetail', () => {
    it('removes detail by Oid', () => {
      const state = transactionReducer(
        { ...initialState, details: [mockDetail, mockDetail2] },
        removeDetail('detail-1')
      );
      expect(state.details).toHaveLength(1);
      expect(state.details[0].Oid).toBe('detail-2');
    });
  });

  describe('setTransactionLoading', () => {
    it('sets loading flag', () => {
      const state = transactionReducer(initialState, setTransactionLoading(true));
      expect(state.loading).toBe(true);
    });
  });

  describe('setTransactionError', () => {
    it('sets error and stops loading', () => {
      const state = transactionReducer(
        { ...initialState, loading: true },
        setTransactionError('Terjadi kesalahan.')
      );
      expect(state.error).toBe('Terjadi kesalahan.');
      expect(state.loading).toBe(false);
    });
  });
});
