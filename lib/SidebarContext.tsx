// lib/SidebarContext.tsx
// Context to share sidebar collapsed state across all pages

'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggle: () => void;
  sidebarWidth: string;
  mainMargin: string;
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  toggle: () => {},
  sidebarWidth: '256px',
  mainMargin: '256px',
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed(prev => !prev);
  const sidebarWidth = collapsed ? '0px' : '256px';
  const mainMargin = collapsed ? '0px' : '256px';

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, toggle, sidebarWidth, mainMargin }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
