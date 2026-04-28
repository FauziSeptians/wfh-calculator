'use client';

const HIDE_ROUTES = ['/'];

import { usePathname } from 'next/navigation';

export default function useHideLayout() {
  const pathname = usePathname();

  console.log(pathname);

  const shouldHide = HIDE_ROUTES.includes(pathname);

  return shouldHide;
}
