import authReducer, {
  setAuth,
  clearAuth,
  setAuthLoading,
  setAuthError,
} from '@/store/slices/authSlice';
import type { AuthState } from '@/types/auth';

const mockUser = {
  Oid: 'user-1',
  UserName: 'testcase',
  FullName: 'Test Case',
  Company: 'company-1',
  CompanyName: 'testcase',
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

describe('authSlice', () => {
  it('returns initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState);
  });

  describe('setAuth', () => {
    it('sets user, token, isAuthenticated and clears error', () => {
      const state = authReducer(
        initialState,
        setAuth({ user: mockUser, token: 'token-abc' })
      );
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe('token-abc');
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('clearAuth', () => {
    it('resets user, token, and isAuthenticated', () => {
      const loggedIn: AuthState = {
        ...initialState,
        user: mockUser,
        token: 'token-abc',
        isAuthenticated: true,
      };
      const state = authReducer(loggedIn, clearAuth());
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('setAuthLoading', () => {
    it('sets loading to true', () => {
      const state = authReducer(initialState, setAuthLoading(true));
      expect(state.loading).toBe(true);
    });

    it('sets loading to false', () => {
      const state = authReducer({ ...initialState, loading: true }, setAuthLoading(false));
      expect(state.loading).toBe(false);
    });
  });

  describe('setAuthError', () => {
    it('sets error message and stops loading', () => {
      const state = authReducer(
        { ...initialState, loading: true },
        setAuthError('Login gagal.')
      );
      expect(state.error).toBe('Login gagal.');
      expect(state.loading).toBe(false);
    });

    it('clears error when null is passed', () => {
      const state = authReducer(
        { ...initialState, error: 'some error' },
        setAuthError(null)
      );
      expect(state.error).toBeNull();
    });
  });
});
