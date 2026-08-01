import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/sidebar/Sidebar';
import { MobileNav } from '../components/MobileNav';
import BusyOverlay from '../components/BusyOverlay';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen h-dvh w-full bg-bg-primary overflow-hidden">
      {/* Desktop/TV sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <main className="flex-1 h-full overflow-y-auto relative flex flex-col">
        {/* Mobile top header */}
        <header className="md:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-bg-primary/95 backdrop-blur-md border-b border-border shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-bg-surface transition-colors text-gold"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className="text-lg font-bold text-gold-gradient">Auto Clipper</span>

          {/* Spacer for centering */}
          <div className="w-9" />
        </header>

        {/* Page content */}
        <div className="flex-1 pb-20 md:pb-0">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom nav */}
      <MobileNav />

      <BusyOverlay />
    </div>
  );
};
