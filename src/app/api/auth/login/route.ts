import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { ELSOFT_API_CORE, TOKEN_COOKIE_NAME } from '@/lib/constants';

const COMPANY_MAP: Record<string, string> = {
  testcase: 'd3170153-6b16-4397-bf89-96533ee149ee',
};

export async function POST(req: NextRequest) {
  try {
    const { domain, username, password } = await req.json();

    if (!domain || !username || !password) {
      return NextResponse.json({ message: 'Domain, username, dan password wajib diisi.' }, { status: 400 });
    }

    const companyId = COMPANY_MAP[domain.toLowerCase()];
    if (!companyId) {
      return NextResponse.json({ message: 'Domain tidak ditemukan.' }, { status: 400 });
    }

    const body = {
      UserName: username,
      Password: password,
      Company: companyId,
      browserInfo: { chrome: true, chrome_view: false, chrome_mobile: false, chrome_mobile_ios: false, safari: false, safari_mobile: false, msedge: false, msie_mobile: false, msie: false },
      machineInfo: { brand: '', model: '', os_name: 'Windows', os_version: '11', type: 'desktop' },
      osInfo: { android: false, blackberry: false, ios: false, windows: true, windows_phone: false, mac: false, linux: false, chrome: false, firefox: false, gamingConsole: false },
      osNameInfo: { name: 'Windows', version: '11', platform: '' },
      Device: `web_${Date.now()}`,
      Model: 'Admin Web',
      Source: '127.0.0.1',
      Exp: 3,
    };

    const { data } = await axios.post(`${ELSOFT_API_CORE}/portal/api/auth/signin`, body);

    const token: string = data?.token || data?.access_token || data?.Token || data?.AccessToken || '';
    if (!token) {
      return NextResponse.json({ message: 'Login gagal. Respons tidak mengandung token.' }, { status: 401 });
    }

    const user = {
      Oid: data?.Oid || data?.oid || '',
      UserName: username,
      FullName: data?.FullName || data?.fullName || username,
      Company: companyId,
      CompanyName: domain,
    };

    const response = NextResponse.json({ token, user });
    response.cookies.set(TOKEN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number } })?.response?.status || 500;
    const message =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      'Login gagal.';
    return NextResponse.json({ message }, { status });
  }
}
