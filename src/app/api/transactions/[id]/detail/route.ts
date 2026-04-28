import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { ELSOFT_API_APP, TOKEN_COOKIE_NAME } from '@/lib/constants';

function getToken(req: NextRequest): string {
  return req.cookies.get(TOKEN_COOKIE_NAME)?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '') || '';
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();

    const payload = {
      index: null,
      Item: body.Item,
      ItemName: body.ItemName,
      Quantity: String(body.Quantity),
      ItemUnit: body.ItemUnit,
      ItemUnitName: body.ItemUnitName,
      Note: body.Note || null,
    };

    const { data } = await axios.post(
      `${ELSOFT_API_APP}/admin/api/v1/stockissue/detail?StockIssue=${id}&Oid=NONE`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json({ data: data?.data || data });
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status || 500;
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menambah detail.';
    return NextResponse.json({ message }, { status });
  }
}
