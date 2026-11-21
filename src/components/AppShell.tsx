'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Initialize and persist sidebar collapsed preference
  useEffect(() => {
    try {
      const stored = localStorage.getItem('talentpulse_sidebar_collapsed');
      if (stored !== null) {
        setCollapsed(stored === 'true');
      }
    } catch (e) {
      // Ignore in non-browser environment
    }
  }, []);

  const handleToggleCollapsed = (valOrUpdater: boolean | ((prev: boolean) => boolean)) => {
    setCollapsed((prev) => {
      const next = typeof valOrUpdater === 'function' ? valOrUpdater(prev) : valOrUpdater;
      try {
        localStorage.setItem('talentpulse_sidebar_collapsed', String(next));
      } catch (e) {}
      return next;
    });
  };

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={handleToggleCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-200 ease-out ${
          collapsed ? 'lg:ml-[68px]' : 'lg:ml-[232px]'
        }`}
      >
        <Header onOpenMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1400px] w-full mx-auto">
          {children}
        </main>

        <footer className="py-4 px-6 border-t border-slate-200 text-xs text-slate-500 bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 max-w-[1400px] mx-auto">
            <span className="text-slate-600 font-medium">
              TalentPulse AI &bull; Enterprise Workforce Intelligence
            </span>
            <span className="text-slate-400">
              Firecrawl Ingestion &bull; LLM Skill Normalization &bull; Deterministic &Delta;% Analytics
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
