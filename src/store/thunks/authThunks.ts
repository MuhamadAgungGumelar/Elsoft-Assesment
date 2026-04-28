import { AppDispatch } from '../index';
import { setAuth, clearAuth, setAuthLoading, setAuthError } from '../slices/authSlice';
import apiClient from '@/lib/axios';
import { LoginPayload } from '@/types/auth';
import Cookies from 'js-cookie';
import { TOKEN_COOKIE_NAME } from '@/lib/constants';

export const loginThunk =
  (payload: LoginPayload) => async (dispatch: AppDispatch) => {
    dispatch(setAuthLoading(true));
    dispatch(setAuthError(null));
    try {
      const { data } = await apiClient.post('/auth/login', payload);
      Cookies.set(TOKEN_COOKIE_NAME, data.token, { expires: 1 });
      dispatch(setAuth({ user: data.user, token: data.token }));
      return { success: true };
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Login gagal. Periksa kembali credentials kamu.';
      dispatch(setAuthError(msg));
      return { success: false, message: msg };
    }
  };

export const logoutThunk = () => async (dispatch: AppDispatch) => {
  try {
    await apiClient.post('/auth/logout');
  } catch {
    // lanjut logout meskipun API gagal
  }
  Cookies.remove(TOKEN_COOKIE_NAME);
  dispatch(clearAuth());
};

export const restoreAuthThunk = () => (dispatch: AppDispatch) => {
  const token = Cookies.get(TOKEN_COOKIE_NAME);
  if (token) {
    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      dispatch(
        setAuth({
          user: {
            Oid: payload.sub || '',
            UserName: 'testcase',
            FullName: 'Test Case',
            Company: payload.comp || '',
            CompanyName: 'testcase',
          },
          token,
        })
      );
    } catch {
      Cookies.remove(TOKEN_COOKIE_NAME);
    }
  }
};
