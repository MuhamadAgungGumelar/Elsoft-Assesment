import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

    const { data } = await axios.post(
      `${ELSOFT_API_APP}/admin/api/v1/item/save?Oid=${id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json({ data: data?.data || data });
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status || 500;
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal mengupdate item.';
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    await axios.delete(`${ELSOFT_API_APP}/admin/api/v1/data/item/delete?Oid=${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status || 500;
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menghapus item.';
    return NextResponse.json({ message }, { status });
  }
}
