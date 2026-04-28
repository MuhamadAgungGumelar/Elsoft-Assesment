'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useTransactions } from '@/hooks/useTransactions';
import { deleteTransactionThunk } from '@/store/thunks/transactionThunks';
import Header from '@/components/layout/Header';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import TransactionForm from '@/components/transactions/TransactionForm';
import { Transaction } from '@/types/transaction';

export default function TransactionPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error, fetchAll } = useTransactions();

  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreated = (id: string) => {
    router.push(`/dashboard/transaction/${id}`);
  };

  const handleDelete = async (tx: Transaction) => {
    if (!confirm(`Hapus transaksi "${tx.Code}"?`)) return;
    setDeletingId(tx.Oid);
    await dispatch(deleteTransactionThunk(tx.Oid));
    setDeletingId(null);
  };

  const statusVariant = (name?: string) => {
    if (!name) return 'default';
    const lower = name.toLowerCase();
    if (lower.includes('entry')) return 'info';
    if (lower.includes('post')) return 'success';
    if (lower.includes('cancel')) return 'error';
    return 'default';
  };

  const columns = [
    {
      key: 'no',
      header: 'No',
      render: (_: Transaction, idx?: number) => (
        <span className="text-gray-400">{(idx ?? 0) + 1}</span>
      ),
      className: 'w-12',
    },
    {
      key: 'CompanyName',
      header: 'Company',
      render: (row: Transaction) => (
        <span className="text-gray-600">{row.CompanyName || '-'}</span>
      ),
    },
    { key: 'Code', header: 'Code' },
    {
      key: 'Date',
      header: 'Date',
      render: (row: Transaction) => row.Date?.split('T')[0] || row.Date || '-',
    },
    { key: 'AccountName', header: 'Account' },
    {
      key: 'StatusName',
      header: 'Status',
      render: (row: Transaction) => (
        <Badge variant={statusVariant(row.StatusName)}>{row.StatusName || '-'}</Badge>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row: Transaction) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => router.push(`/dashboard/transaction/${row.Oid}`)}
          >
            Detail
          </Button>
          <Button
            size="sm"
            variant="danger"
            loading={deletingId === row.Oid}
            onClick={() => handleDelete(row)}
          >
            Hapus
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Header title="Transaksi Stock" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Daftar Transaksi</h2>
            <p className="text-sm text-gray-500">{transactions.length} transaksi</p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Transaksi
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" className="text-blue-600" />
          </div>
        ) : (
          <Table
            columns={columns}
            data={transactions}
            keyExtractor={(row) => row.Oid}
            emptyMessage="Belum ada transaksi. Klik 'Tambah Transaksi' untuk mulai."
          />
        )}
      </main>

      <TransactionForm
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
