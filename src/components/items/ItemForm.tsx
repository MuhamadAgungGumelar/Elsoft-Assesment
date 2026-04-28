'use client';

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { createItemThunk, updateItemThunk } from '@/store/thunks/itemThunks';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { Item } from '@/types/item';
import { COMPANY_NAME, ITEM_UNIT_NAME } from '@/lib/constants';

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  editItem?: Item | null;
}

const defaultForm = { Label: '', IsActive: 'true' };

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

export default function ItemForm({ isOpen, onClose, editItem }: ItemFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editItem) {
      setForm({
        Label: editItem.Label,
        IsActive: String(editItem.IsActive) === 'true' || editItem.IsActive === true ? 'true' : 'false',
      });
    } else {
      setForm(defaultForm);
    }
    setError(null);
  }, [editItem, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.Label.trim()) {
      setError('Title tidak boleh kosong.');
      return;
    }
    setLoading(true);
    setError(null);

    const result = editItem
      ? await dispatch(updateItemThunk(editItem.Oid, form))
      : await dispatch(createItemThunk(form));

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
      title={editItem ? 'Edit Item' : 'Tambah Item'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <ReadonlyField label="Company" value={COMPANY_NAME} />
          <ReadonlyField label="Item Type" value="Standard" />
          <ReadonlyField label="Code" value={editItem?.Code || '<<Auto>>'} />
          <Input
            label="Title"
            value={form.Label}
            onChange={(e) => setForm({ ...form, Label: e.target.value })}
            placeholder="Contoh: Item A"
            required
          />
          <ReadonlyField label="Item Group" value="Default Group" />
          <ReadonlyField label="Item Account Group" value="Default Account Group" />
          <ReadonlyField label="Item Unit" value={editItem?.ItemUnitName || ITEM_UNIT_NAME} />
          <Select
            label="Is Active"
            value={form.IsActive}
            onChange={(e) => setForm({ ...form, IsActive: e.target.value })}
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
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
            {editItem ? 'Simpan Perubahan' : 'Tambah Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
