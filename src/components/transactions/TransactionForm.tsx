'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import {
  createTransactionThunk,
  updateTransactionThunk,
} from '@/store/thunks/transactionThunks';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Transaction } from '@/types/transaction';
import { COMPANY_NAME, ACCOUNT_NAME } from '@/lib/constants';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTransaction?: Transaction | null;
  onCreated?: (id: string) => void;
}

const today = new Date().toISOString().split('T')[0];
const defaultForm = { Date: today, Note: '' };

function ReadonlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-500">
        {value}
      </div>
    </div>
  );
}

export default function TransactionForm({
  isOpen,
  onClose,
  editTransaction,
  onCreated,
}: TransactionFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editTransaction) {
      setForm({
        Date: editTransaction.Date?.split('T')[0] || today,
        Note: editTransaction.Note || '',
      });
    } else {
      setForm(defaultForm);
    }
    setError(null);
  }, [editTransaction, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.Date) {
      setError('Tanggal tidak boleh kosong.');
      return;
    }
    setLoading(true);
    setError(null);

    const payload = { Date: form.Date, Note: form.Note || null };

    if (editTransaction) {
      const result = await dispatch(updateTransactionThunk(editTransaction.Oid, payload));
      setLoading(false);
      if (result.success) {
        onClose();
      } else {
        setError(result.message || 'Terjadi kesalahan.');
      }
    } else {
      const result = await dispatch(createTransactionThunk(payload));
      setLoading(false);
      if (result.success && result.data) {
        onClose();
        onCreated?.(result.data.Oid);
      } else {
        setError(result.message || 'Terjadi kesalahan.');
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <ReadonlyField label="Company" value={COMPANY_NAME} />
          <ReadonlyField
            label="Code"
            value={editTransaction?.Code || '<<AutoGenerate>>'}
          />
          <div className="col-span-2">
            <Input
              label="Date"
              type="date"
              value={form.Date}
              onChange={(e) => setForm({ ...form, Date: e.target.value })}
              required
            />
          </div>
          <div className="col-span-2">
            <ReadonlyField label="Account" value={ACCOUNT_NAME} />
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Note</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Opsional..."
              value={form.Note}
              onChange={(e) => setForm({ ...form, Note: e.target.value })}
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" loading={loading}>
            {editTransaction ? 'Simpan Perubahan' : 'Tambah Transaksi'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
