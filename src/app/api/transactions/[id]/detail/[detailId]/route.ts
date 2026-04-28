import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { ELSOFT_API_APP, TOKEN_COOKIE_NAME } from '@/lib/constants';

function getToken(req: NextRequest): string {
  return req.cookies.get(TOKEN_COOKIE_NAME)?.value ||
    req.headers.get('authorization')?.replace('Bearer ', '') || '';
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; detailId: string }> }
) {
  const { id, detailId } = await params;
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();

    const payload = {
      Oid: detailId,
      index: body.index || '1',
      Item: body.Item,
      ItemName: body.ItemName,
      Quantity: String(body.Quantity),
      ItemUnit: body.ItemUnit,
      ItemUnitName: body.ItemUnitName,
      Note: body.Note || null,
    };

    const { data } = await axios.post(
      `${ELSOFT_API_APP}/admin/api/v1/stockissue/detail?StockIssue=${id}&Oid=${detailId}`,
      payload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return NextResponse.json({ data: data?.data || data });
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status || 500;
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal mengupdate detail.';
    return NextResponse.json({ message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; detailId: string }> }
) {
  const { detailId } = await params;
  const token = getToken(req);
  if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    await axios.delete(`${ELSOFT_API_APP}/admin/api/v1/stockissue/detail/${detailId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status || 500;
    const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Gagal menghapus detail.';
    return NextResponse.json({ message }, { status });
  }
}
