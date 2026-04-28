'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ domain: '', username: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login(form);
    if ((result as { success: boolean }).success) {
      router.push('/dashboard');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Elsoft App</h1>
          <p className="mt-1 text-sm text-gray-400">Masuk ke akun kamu</p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Domain"
              type="text"
              placeholder="testcase"
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              required
              autoFocus
            />
            <Input
              label="Username"
              type="text"
              placeholder="testcase"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full mt-2" size="lg">
              Masuk
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
