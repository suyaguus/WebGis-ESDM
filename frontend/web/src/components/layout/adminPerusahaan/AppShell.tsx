import React from 'react';
import AdminSidebar from './Sidebar';
import AdminTopbar  from './Topbar';

interface AdminAppShellProps {
  children: React.ReactNode;
  fullHeight?: boolean;
}

export default function AdminAppShell({ children, fullHeight }: AdminAppShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F0F4F8]">
      <AdminSidebar />
      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
        <AdminTopbar />
        <main className={fullHeight ? 'flex-1 overflow-hidden' : 'flex-1 overflow-y-auto overflow-x-hidden'}>
          {children}
        </main>
      </div>
    </div>
  );
}
