'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import {
  createDetailThunk,
  updateDetailThunk,
} from '@/store/thunks/transactionThunks';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { TransactionDetail } from '@/types/transaction';
import { ITEM_UNIT_ID, ITEM_UNIT_NAME } from '@/lib/constants';

interface TransactionDetailFormProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string;
  editDetail?: TransactionDetail | null;
}

const defaultForm = {
  Item: '',
  ItemName: '',
  Quantity: '1',
  ItemUnit: ITEM_UNIT_ID,
  ItemUnitName: ITEM_UNIT_NAME,
  Note: '',
};

export default function TransactionDetailForm({
  isOpen,
  onClose,
  transactionId,
  editDetail,
}: TransactionDetailFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.item.items);

  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editDetail) {
      setForm({
        Item: editDetail.Item,
        ItemName: editDetail.ItemName,
        Quantity: String(editDetail.Quantity),
        ItemUnit: editDetail.ItemUnit,
        ItemUnitName: editDetail.ItemUnitName,
        Note: editDetail.Note || '',
      });
    } else {
      setForm(defaultForm);
    }
    setError(null);
  }, [editDetail, isOpen]);

  const handleItemChange = (oid: string) => {
    const selected = items.find((i) => i.Oid === oid);
    if (selected) {
      setForm({
        ...form,
        Item: selected.Oid,
        ItemName: selected.Label,
        ItemUnit: selected.ItemUnit || ITEM_UNIT_ID,
        ItemUnitName: selected.ItemUnitName || ITEM_UNIT_NAME,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.Item) {
      setError('Pilih item terlebih dahulu.');
      return;
    }
    if (!form.Quantity || parseFloat(form.Quantity) <= 0) {
      setError('Quantity harus lebih dari 0.');
      return;
    }
    setLoading(true);
    setError(null);

    const payload = {
      Item: form.Item,
      ItemName: form.ItemName,
      Quantity: form.Quantity,
      ItemUnit: form.ItemUnit,
      ItemUnitName: form.ItemUnitName,
      Note: form.Note || null,
    };

    const result = editDetail
      ? await dispatch(updateDetailThunk(transactionId, editDetail.Oid, payload))
      : await dispatch(createDetailThunk(transactionId, payload));

    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.message || 'Terjadi kesalahan.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editDetail ? 'Edit Detail' : 'Tambah Detail'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Item</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.Item}
            onChange={(e) => handleItemChange(e.target.value)}
            required
          >
            <option value="" disabled>Pilih item...</option>
            {items.map((item) => (
              <option key={item.Oid} value={item.Oid}>
                {item.Label} {item.Code ? `- ${item.Code}` : ''}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Quantity"
          type="number"
          min="1"
          step="1"
          value={form.Quantity}
          onChange={(e) => setForm({ ...form, Quantity: e.target.value })}
          required
        />

        <Input
          label="Unit"
          value={form.ItemUnitName}
          readOnly
          className="bg-gray-50"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Catatan</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={2}
            placeholder="Opsional..."
            value={form.Note}
            onChange={(e) => setForm({ ...form, Note: e.target.value })}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" loading={loading}>
            {editDetail ? 'Simpan Perubahan' : 'Tambah Detail'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
