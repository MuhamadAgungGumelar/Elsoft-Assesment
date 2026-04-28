'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { loginThunk, logoutThunk, restoreAuthThunk } from '@/store/thunks/authThunks';
import { LoginPayload } from '@/types/auth';
import { useEffect } from 'react';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(restoreAuthThunk());
    }
  }, [dispatch, isAuthenticated]);

  const login = (payload: LoginPayload) => dispatch(loginThunk(payload));
  const logout = () => dispatch(logoutThunk());

  return { user, token, isAuthenticated, loading, error, login, logout };
}
