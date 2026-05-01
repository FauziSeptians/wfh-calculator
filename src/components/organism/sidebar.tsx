'use client';

import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { LayoutDashboard, Settings } from 'lucide-react';
import Link from 'next/link';
import { useLayout } from './layoutContext';

export default function Sidebar({ children }: { children?: React.ReactNode }) {
  const { isHidden } = useLayout();

  if (isHidden) return null;

  return (
    <ShadcnSidebar>
      <SidebarHeader className="flex h-16 items-center justify-center border-b">
        <span className="text-lg font-bold tracking-tight">App Logo</span>
      </SidebarHeader>

      <SidebarContent>
        {children ? (
          children
        ) : (
          <SidebarGroup>
            <SidebarGroupLabel>Menu Aplikasi</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </ShadcnSidebar>
  );
}
