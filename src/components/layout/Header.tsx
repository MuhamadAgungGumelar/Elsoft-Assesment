'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm font-semibold">
            {user?.FullName?.[0] || user?.UserName?.[0] || 'U'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.FullName || user?.UserName || 'User'}
            </p>
            <p className="text-xs text-gray-500">{user?.CompanyName || ''}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
