import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Calendar,
  Settings,
  Scale,
  X,
  ChevronRight,
} from 'lucide-react';
import { getUserProfile } from '../services/dataStorage';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Judgments', path: '/judgments', icon: FileText },
  { name: 'Cases', path: '/cases', icon: Briefcase },
  { name: 'Hearings', path: '/hearings', icon: Calendar },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar({ mobileOpen, onCloseMobile }) {
  const [profile, setProfile] = useState(() => getUserProfile());

  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfile(getUserProfile());
    };
    window.addEventListener('justiq_profile_updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);
    return () => {
      window.removeEventListener('justiq_profile_updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  // Compute initials
  const initials = profile.name
    ? profile.name
        .replace(/^(Adv\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, '')
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'AS';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1b1f1e]/60 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Refined graphite sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#252A29] text-[#FFFFFF] flex flex-col border-r border-[#323837] shadow-lg md:shadow-none transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header with clean alignment */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#323837]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-[6px] bg-[#A48658]/15 border border-[#A48658]/35 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4 text-[#A48658]" />
            </div>
            <div className="flex flex-col">
              <span className="font-editorial text-base font-bold tracking-wide text-[#FFFFFF] leading-tight">
                JUSTIQ
              </span>
              <span className="text-[10px] text-[#A48658] font-medium tracking-wider uppercase leading-tight">
                Legal Intelligence
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="p-1.5 rounded-[6px] text-[#DEDAD0] hover:text-[#FFFFFF] hover:bg-[#323837] md:hidden"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `group flex items-center justify-between px-3.5 py-2.5 rounded-[6px] text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-[#323837] text-[#FFFFFF] border-l-2 border-[#A48658]'
                      : 'text-[#DEDAD0]/80 hover:bg-[#323837]/50 hover:text-[#FFFFFF]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-[#A48658]'
                            : 'text-[#DEDAD0]/60 group-hover:text-[#FFFFFF]'
                        }`}
                      />
                      <span>{item.name}</span>
                    </div>

                    {isActive && (
                      <ChevronRight className="w-3.5 h-3.5 text-[#A48658] opacity-80" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User / Workspace footer profile with clean spacing */}
        <div className="p-4 border-t border-[#323837] bg-[#1e2221]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-[6px] bg-[#A48658]/20 text-[#A48658] border border-[#A48658]/40 flex items-center justify-center text-xs font-semibold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#FFFFFF] truncate leading-tight">
                {profile.name}
              </p>
              <p className="text-[11px] text-[#A48658] truncate mt-0.5">
                {profile.barAssociation || 'Bar Council of Delhi'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
