'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Globe,
  TrendingUp,
  Search,
  Sparkles,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Activity,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean | ((prev: boolean) => boolean)) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Data Sources & Crawl',
      href: '/sources',
      icon: Globe,
      badge: 'Firecrawl',
    },
    {
      label: 'Demand Intelligence',
      href: '/intelligence',
      icon: TrendingUp,
      badge: 'QoQ',
    },
    {
      label: 'Skill Explorer',
      href: '/skills',
      icon: Search,
      badge: null,
    },
    {
      label: 'AI Market Insights',
      href: '/insights',
      icon: Sparkles,
      badge: 'AI',
    },
    {
      label: 'Reports & Export',
      href: '/reports',
      icon: FileText,
      badge: 'CSV/PDF',
    },
    {
      label: 'Settings & Status',
      href: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Brand Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-slate-200 flex-shrink-0">
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5 overflow-hidden group"
        >
          <div className="w-7 h-7 rounded-md bg-blue-600 text-white flex items-center justify-center font-semibold text-xs flex-shrink-0 shadow-2xs">
            <Activity className="w-4 h-4" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col truncate">
              <span className="font-semibold text-slate-900 text-sm leading-tight tracking-tight">
                TalentPulse <span className="text-blue-600">AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                Skill Demand Monitor
              </span>
            </div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="hidden lg:flex p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Mobile Close Button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto" aria-label="Main Navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-colors relative group ${
                isActive
                  ? 'bg-slate-100/80 text-slate-900 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={collapsed && !mobileOpen ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />

              {(!collapsed || mobileOpen) && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-semibold tracking-tight ${
                        isActive
                          ? 'bg-slate-200/80 text-slate-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Active thin indicator */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-blue-600 rounded-r" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-200 flex-shrink-0 bg-slate-50/50">
        {(!collapsed || mobileOpen) ? (
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-slate-700">Analytics Engine</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Q1-Q4 '26</span>
          </div>
        ) : (
          <div className="flex justify-center" title="Analytics Engine Active">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden lg:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-200 ease-out ${
          collapsed ? 'w-[68px]' : 'w-[232px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-2xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-200 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-modal="true"
        role="dialog"
      >
        {sidebarContent}
      </aside>
    </>
  );
}
