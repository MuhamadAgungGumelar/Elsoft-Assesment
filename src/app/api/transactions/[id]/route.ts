import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import {
  ELSOFT_API_APP,
  TOKEN_COOKIE_NAME,
  COMPANY_ID,
  COMPANY_NAME,
  ACCOUNT_ID,
  ACCOUNT_NAME,
} from '@/lib/constants';

function getToken(req: NextRequest): string {
  return req.cookies.get(TOKEN_COOKIE_NAME)?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '') || '';
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const [parentRes, detailRes] = await Promise.all([
      axios.get(`${ELSOFT_API_APP}/admin/api/v1/stockissue/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`${ELSOFT_API_APP}/admin/api/v1/stockissue/${id}/detail`, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => ({ data: [] })),
    ]);

    const parent = parentRes.data?.data || parentRes.data;
    const details = detailRes.data?.data || detailRes.data || [];

    return NextResponse.json({ data: parent, details });
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status || 500;
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal mengambil transaksi.';
    return NextResponse.json({ message }, { status });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();

    const payload = {
      Oid: id,
      Company: COMPANY_ID,
      CompanyName: COMPANY_NAME,
      Code: body.Code || '<<AutoGenerate>>',
      Date: body.Date,
      Account: ACCOUNT_ID,
      AccountName: ACCOUNT_NAME,
      Status: body.Status,
      StatusName: body.StatusName,
      Note: body.Note || null,
    };

    const { data } = await axios.post(
      `${ELSOFT_API_APP}/admin/api/v1/stockissue/${id}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json({ data: data?.data || data });
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status || 500;
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal mengupdate transaksi.';
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    await axios.delete(`${ELSOFT_API_APP}/admin/api/v1/stockissue/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status || 500;
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menghapus transaksi.';
    return NextResponse.json({ message }, { status });
  }
}
