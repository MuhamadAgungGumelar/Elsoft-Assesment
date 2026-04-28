'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { useTransactions } from '@/hooks/useTransactions';
import { deleteDetailThunk } from '@/store/thunks/transactionThunks';
import { fetchItemsThunk } from '@/store/thunks/itemThunks';
import Header from '@/components/layout/Header';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import TransactionForm from '@/components/transactions/TransactionForm';
import TransactionDetailForm from '@/components/transactions/TransactionDetailForm';
import { TransactionDetail } from '@/types/transaction';

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { selectedTransaction, details, loading, error, fetchOne } = useTransactions();
  const itemsLoaded = useSelector((state: RootState) => state.item.items.length > 0);

  const [showEditParent, setShowEditParent] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [editingDetail, setEditingDetail] = useState<TransactionDetail | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOne(id);
    if (!itemsLoaded) dispatch(fetchItemsThunk());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddDetail = () => {
    setEditingDetail(null);
    setShowDetailForm(true);
  };

  const handleEditDetail = (detail: TransactionDetail) => {
    setEditingDetail(detail);
    setShowDetailForm(true);
  };

  const handleCloseDetailForm = () => {
    setShowDetailForm(false);
    setEditingDetail(null);
    // State sudah diupdate oleh addDetail/updateDetail thunk, tidak perlu re-fetch
  };

  const handleDeleteDetail = async (detail: TransactionDetail) => {
    if (!confirm(`Hapus detail item "${detail.ItemName}"?`)) return;
    setDeletingId(detail.Oid);
    await dispatch(deleteDetailThunk(id, detail.Oid));
    setDeletingId(null);
  };

  const detailColumns = [
    {
      key: 'index',
      header: '#',
      render: (_: TransactionDetail, idx?: number) => <span className="text-gray-400">{(idx ?? 0) + 1}</span>,
    },
    { key: 'ItemName', header: 'Item' },
    { key: 'Quantity', header: 'Qty', className: 'text-right' },
    { key: 'ItemUnitName', header: 'Unit' },
    { key: 'Note', header: 'Catatan', render: (row: TransactionDetail) => row.Note || '-' },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row: TransactionDetail) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleEditDetail(row)}>
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            loading={deletingId === row.Oid}
            onClick={() => handleDeleteDetail(row)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  const statusVariant = (name?: string) => {
    if (!name) return 'default' as const;
    const lower = name.toLowerCase();
    if (lower.includes('entry')) return 'info' as const;
    if (lower.includes('post')) return 'success' as const;
    if (lower.includes('cancel')) return 'error' as const;
    return 'default' as const;
  };

  return (
    <>
      <Header title="Detail Transaksi" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/transaction')}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading && !selectedTransaction ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" className="text-blue-600" />
          </div>
        ) : selectedTransaction ? (
          <>
            {/* Parent Info Card */}
            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Informasi Transaksi</h2>
                <Button size="sm" variant="secondary" onClick={() => setShowEditParent(true)}>
                  Edit
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Kode</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">{selectedTransaction.Code}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Tanggal</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.Date?.split('T')[0]}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Akun</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedTransaction.AccountName}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Status</p>
                  <div className="mt-1">
                    <Badge variant={statusVariant(selectedTransaction.StatusName)}>
                      {selectedTransaction.StatusName || '-'}
                    </Badge>
                  </div>
                </div>
                {selectedTransaction.Note && (
                  <div className="col-span-2 sm:col-span-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Catatan</p>
                    <p className="mt-1 text-sm text-gray-900">{selectedTransaction.Note}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Detail Table */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Item Detail</h2>
                  <p className="text-sm text-gray-500">{details.length} item</p>
                </div>
                <Button size="sm" onClick={handleAddDetail}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Detail
                </Button>
              </div>
              <div className="p-6">
                <Table
                  columns={detailColumns}
                  data={details}
                  keyExtractor={(row) => row.Oid}
                  emptyMessage="Belum ada item detail."
                />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16 text-gray-400">Transaksi tidak ditemukan.</div>
        )}
      </main>

      {selectedTransaction && (
        <>
          <TransactionForm
            isOpen={showEditParent}
            onClose={() => { setShowEditParent(false); fetchOne(id); }}
            editTransaction={selectedTransaction}
          />
          <TransactionDetailForm
            isOpen={showDetailForm}
            onClose={handleCloseDetailForm}
            transactionId={id}
            editDetail={editingDetail}
          />
        </>
      )}
    </>
  );
}
