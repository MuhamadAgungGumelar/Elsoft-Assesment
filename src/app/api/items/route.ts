import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { query } from '@/lib/db';
import {
  ELSOFT_API_APP,
  TOKEN_COOKIE_NAME,
  COMPANY_ID,
  ITEM_TYPE_ID,
  ITEM_GROUP_ID,
  ITEM_ACCOUNT_GROUP_ID,
  ITEM_UNIT_ID,
} from '@/lib/constants';

function getToken(req: NextRequest): string {
  return req.cookies.get(TOKEN_COOKIE_NAME)?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '') || '';
}

export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const { data } = await axios.get(`${ELSOFT_API_APP}/admin/api/v1/item/list`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const items = data?.data || data || [];

    await query(
      `INSERT INTO items (oid, code, label, item_unit_name, is_active) VALUES ?
       ON DUPLICATE KEY UPDATE code=VALUES(code), label=VALUES(label), item_unit_name=VALUES(item_unit_name), is_active=VALUES(is_active)`,
      [items.map((i: { Oid: string; Code: string; Label: string; ItemUnitName?: string; IsActive?: boolean }) => [
        i.Oid, i.Code, i.Label, i.ItemUnitName || '', i.IsActive ? 1 : 0,
      ])]
    ).catch(() => {});

    return NextResponse.json({ data: items });
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status || 500;
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal mengambil data item.';
    return NextResponse.json({ message }, { status });
  }
}

export async function POST(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();

    const payload = {
      Company: COMPANY_ID,
      ItemType: ITEM_TYPE_ID,
      Code: '<<Auto>>',
      Label: body.Label,
      ItemGroup: ITEM_GROUP_ID,
      ItemAccountGroup: ITEM_ACCOUNT_GROUP_ID,
      ItemUnit: ITEM_UNIT_ID,
      IsActive: body.IsActive ?? 'true',
    };

    const { data } = await axios.post(`${ELSOFT_API_APP}/admin/api/v1/item`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return NextResponse.json({ data: data?.data || data });
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status || 500;
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal membuat item.';
    return NextResponse.json({ message }, { status });
  }
}
