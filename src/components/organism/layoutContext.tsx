'use client';

import { createContext, useContext } from 'react';

interface LayoutComponentContextType {
  isHidden: boolean;
  pathname: string;
}

export const LayoutContext = createContext<LayoutComponentContextType>({
  isHidden: false,
  pathname: '',
});

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within Layout');
  return context;
};
