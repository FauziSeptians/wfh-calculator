'use client';

import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { classNames } from '@/utils/classNames';
import { usePathname } from 'next/navigation';
import React from 'react';
import Footer from '../organism/footer';
import { LayoutContext, useLayout } from '../organism/layoutContext';
import Navbar from '../organism/navbar';

interface LayoutProps {
  children: React.ReactNode;
  hiddenRoutes?: string[];
}

function Main({ children }: { children?: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      {children}
    </main>
  );
}

function Content({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { isHidden } = useLayout();

  if (isHidden) {
    return (
      <section className={classNames('flex min-h-screen w-full', className)}>
        {children}
      </section>
    );
  }

  return (
    <SidebarInset
      className={classNames('flex min-h-screen flex-col', className)}
    >
      {children}
    </SidebarInset>
  );
}

function LayoutComponent({ children, hiddenRoutes = [] }: LayoutProps) {
  const pathname = usePathname();
  const isHidden = hiddenRoutes.includes(pathname);

  return (
    <LayoutContext.Provider value={{ isHidden, pathname }}>
      <SidebarProvider>
        <section id="layout" className="flex min-h-screen w-full bg-neutral-50">
          {children}
        </section>
      </SidebarProvider>
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
  return (
    <LayoutComponent hiddenRoutes={hiddenRoutes}>
      {/* <LayoutComponent.Sidebar /> */}
      <LayoutComponent.Content>
        <LayoutComponent.Navbar />
        <LayoutComponent.Main>{children}</LayoutComponent.Main>
        <LayoutComponent.Footer />
      </LayoutComponent.Content>
    </LayoutComponent>
  );
}
