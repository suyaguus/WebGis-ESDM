import React from 'react';
import SurveyorSidebar from './Sidebar';
import SurveyorTopbar  from './Topbar';
import { useAppStore } from '../../../store';

interface SurveyorAppShellProps {
  children: React.ReactNode;
  fullHeight?: boolean;
}

export default function SurveyorAppShell({ children, fullHeight }: SurveyorAppShellProps) {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useAppStore();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F0F4F8]">
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-[1500] bg-black/30 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <div
        className={[
          'fixed inset-y-0 left-0 z-[1600] md:static md:z-auto md:translate-x-0 transition-transform duration-200',
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        <SurveyorSidebar onClose={() => setMobileSidebarOpen(false)} />
      </div>

      <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
        <SurveyorTopbar />
        <main className={fullHeight ? 'flex-1 overflow-hidden' : 'flex-1 overflow-y-auto overflow-x-hidden'}>
          {children}
        </main>
      </div>
    </div>
  );
}
