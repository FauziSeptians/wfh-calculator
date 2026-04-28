'use client';

import { classNames } from '@/utils/classNames';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext } from 'react';

interface LayoutComponentContextType {
  isHidden: boolean;
  pathname: string;
}

interface LayoutComponentProps {
  children: React.ReactNode;
  hiddenRoutes?: string[];
}

interface LayoutProps extends LayoutComponentProps {}

const LayoutContext = createContext<LayoutComponentContextType>({
  isHidden: false,
  pathname: '',
});

export const useLayout = () => {
  const context = useContext(LayoutContext);

  if (!context) throw new Error('useLayout must be used within Layout');
  return context;
};

function Navbar({ children }: { children?: React.ReactNode }) {
  const { isHidden } = useLayout();
  if (isHidden) return null;
  return <nav className="h-12 bg-amber-50">{children ?? 'INI NAVBAR'}</nav>;
}

function Sidebar({ children }: { children?: React.ReactNode }) {
  const { isHidden } = useLayout();
  if (isHidden) return null;
  return <aside className="w-1/6">{children ?? 'SIDEBAR'}</aside>;
}

function Main({
  children,
  isHide,
}: {
  children?: React.ReactNode;
  isHide: boolean;
}) {
  return (
    <main className={classNames(isHide ? 'w-full' : 'w-5/6')}>{children}</main>
  );
}

function Content({ children }: { children?: React.ReactNode }) {
  return (
    <section id="main-layout" className="flex w-full">
      {children}
    </section>
  );
}

function Footer({
  children,
  isHide,
}: {
  children?: React.ReactNode;
  isHide: boolean;
}) {
  return (
    <footer className={classNames(isHide ? 'hidden' : '')}>
      {children ?? 'INI FOOTER'}
    </footer>
  );
}

function LayoutComponent({ children, hiddenRoutes = [] }: LayoutProps) {
  const pathname = usePathname();
  const isHidden = hiddenRoutes.includes(pathname);

  return (
    <LayoutContext.Provider value={{ isHidden, pathname }}>
      <section id="layout" className="bg-neutral-100">
        {children}
      </section>
    </LayoutContext.Provider>
  );
}

LayoutComponent.Navbar = Navbar;
LayoutComponent.Sidebar = Sidebar;
LayoutComponent.Main = Main;
LayoutComponent.Content = Content;
LayoutComponent.Footer = Footer;

export default function Layout({
  children,
  hiddenRoutes,
}: Readonly<LayoutProps>) {
  const { isHidden } = useLayout();

  return (
    <LayoutComponent hiddenRoutes={hiddenRoutes}>
      <LayoutComponent.Navbar />
      <LayoutComponent.Content>
        <LayoutComponent.Sidebar />
        <LayoutComponent.Main isHide={!isHidden}>
          {children}
        </LayoutComponent.Main>
      </LayoutComponent.Content>
      <LayoutComponent.Footer isHide={!isHidden} />
    </LayoutComponent>
  );
}
