import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const pageTitleMap = {
  '/': 'Chambers Overview',
  '/judgments': 'Judgment Archive',
  '/judgments/upload': 'Upload Document',
  '/cases': 'Case Matters',
  '/cases/new': 'New Case Docket',
  '/hearings': 'Court Calendar & Cause List',
  '/hearings/new': 'Schedule Listing',
  '/settings': 'Preferences & Pipeline',
};

export function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const currentTitle = pageTitleMap[location.pathname] || 'JUSTIQ Workspace';

  return (
    <div className="min-h-screen bg-[#F4F2EC] flex text-[#252A29]">
      {/* Refined Sidebar */}
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />

      {/* Main layout container */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0 min-h-screen">
        <Header
          pageTitle={currentTitle}
          onOpenMobileNav={() => setMobileOpen(true)}
        />

        {/* Page content view */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
