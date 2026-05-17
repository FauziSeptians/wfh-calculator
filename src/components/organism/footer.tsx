'use client';

import React from 'react';
import { useLayout } from './layoutContext';

export default function Footer({ children }: { children?: React.ReactNode }) {
  const { isHidden } = useLayout();

  if (isHidden) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto h-32 bg-white px-4 py-5 md:px-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-gray-500">
          © {currentYear}{' '}
          <span className="font-medium text-gray-900">WFH Calculator - fauziseptians</span>. All
          rights reserved.
        </p>

        {children ? (
          children
        ) : (
          <nav className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <a href="#" className="transition-colors hover:text-gray-900">
              Bantuan
            </a>
            <a href="#" className="transition-colors hover:text-gray-900">
              Kebijakan Privasi
            </a>
          </nav>
        )}
      </div>
    </footer>
  );
}
