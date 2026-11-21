'use client';

import React, { useState } from 'react';
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
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
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
      badge: 'PDF/CSV',
    },
    {
      label: 'Settings & Status',
      href: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Logo & Name */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm">
            <Activity className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-slate-900 text-base leading-tight tracking-tight">
                TalentPulse<span className="text-indigo-600">AI</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Skill Demand Monitor</span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="p-1.5 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2">
          {!collapsed && (
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
              Platform Modules
            </span>
          )}
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />

              {!collapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        isActive
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}

              {/* Active Indicator Bar */}
              {isActive && (
                <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-indigo-600 rounded-r" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer Info / Data Sync */}
      <div className="p-3 border-t border-slate-200">
        {!collapsed ? (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-800">Intelligence Engine</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Monitoring verified technical and professional competencies across Q1–Q4 2026.
            </p>
          </div>
        ) : (
          <div className="flex justify-center py-2" title="Engine Active">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
