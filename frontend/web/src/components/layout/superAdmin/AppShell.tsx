import React from 'react';
import Sidebar from './Sidebar';
import Topbar from '../../../../src/components/layout/superAdmin/Topbar';

interface AppShellProps {
  children: React.ReactNode;
  fullHeight?: boolean;
}

export default function AppShell({ children, fullHeight }: AppShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F0F4F8]">
      <Sidebar />
      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
        <Topbar />
        <main className={fullHeight ? 'flex-1 overflow-hidden' : 'flex-1 overflow-y-auto overflow-x-hidden'}>
          {children}
        </main>
      </div>
    </div>
  );
}
