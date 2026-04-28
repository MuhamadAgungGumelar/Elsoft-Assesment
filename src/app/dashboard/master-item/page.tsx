'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { useItems } from '@/hooks/useItems';
import { setSelectedItem } from '@/store/slices/itemSlice';
import { deleteItemThunk } from '@/store/thunks/itemThunks';
import Header from '@/components/layout/Header';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import ItemForm from '@/components/items/ItemForm';
import { Item } from '@/types/item';

export default function MasterItemPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, selectedItem, loading, error } = useItems();

  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleEdit = (item: Item) => {
    dispatch(setSelectedItem(item));
    setShowForm(true);
  };

  const handleAdd = () => {
    dispatch(setSelectedItem(null));
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    dispatch(setSelectedItem(null));
  };

  const handleDelete = async (item: Item) => {
    if (!confirm(`Hapus item "${item.Label}"?`)) return;
    setDeletingId(item.Oid);
    await dispatch(deleteItemThunk(item.Oid));
    setDeletingId(null);
  };

  const columns = [
    {
      key: 'no',
      header: 'No',
      render: (_: Item, idx?: number) => <span className="text-gray-400">{(idx ?? 0) + 1}</span>,
      className: 'w-12',
    },
    { key: 'Label', header: 'Title' },
    {
      key: 'CompanyName',
      header: 'Company',
      render: (row: Item) => <span className="text-gray-600">{row.CompanyName || 'testcase'}</span>,
    },
    { key: 'Code', header: 'Code' },
    {
      key: 'ItemGroupName',
      header: 'Item Group',
      render: (row: Item) => <span className="text-gray-600">{row.ItemGroupName || '-'}</span>,
    },
    {
      key: 'IsActive',
      header: 'Is Active',
      render: (row: Item) =>
        String(row.IsActive) === 'true' || row.IsActive === true ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="error">Inactive</Badge>
        ),
    },
    {
      key: 'Balance',
      header: 'Balance',
      render: (row: Item) => (
        <span className="text-gray-600">{row.Balance ?? '-'}</span>
      ),
      className: 'text-right',
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (row: Item) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleEdit(row)}>
            Edit
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
      <Header title="Master Item" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Daftar Item</h2>
            <p className="text-sm text-gray-500">{items.length} item terdaftar</p>
          </div>
          <Button onClick={handleAdd}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Item
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
            data={items}
            keyExtractor={(row) => row.Oid}
            emptyMessage="Belum ada item. Klik 'Tambah Item' untuk mulai."
          />
        )}
      </main>

      <ItemForm
        isOpen={showForm}
        onClose={handleCloseForm}
        editItem={selectedItem}
      />
    </>
  );
}
