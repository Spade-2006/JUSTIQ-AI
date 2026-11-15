import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, User, LogOut, Settings as SettingsIcon, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserProfile, getHearings } from '../services/dataStorage';

export function Header({ onOpenMobileNav, pageTitle = 'Dashboard' }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => getUserProfile());
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadNotif, setUnreadNotif] = useState(true);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const mobileSearchRef = useRef(null);

  // Sync profile changes
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

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifDropdown(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
        setShowMobileSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/judgments?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowMobileSearch(false);
    }
  };

  const handleSignOut = () => {
    setShowUserDropdown(false);
    if (confirm('Sign out of JUSTIQ?')) {
      localStorage.removeItem('justiq_auth_user');
      navigate('/login');
    }
  };

  const shortName = profile.name
    ? profile.name.split(' ').slice(0, 2).join(' ')
    : 'Adv. Sharma';

  // Get dynamic next hearing notice if available
  const upcomingHearings = getHearings();
  const nextAlert = upcomingHearings[0];

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#FFFFFF] border-b border-[#DEDAD0] flex items-center justify-between px-4 sm:px-6 shadow-2xs">
      <div className="flex items-center space-x-3 min-w-0">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="p-1.5 -ml-1 text-[#252A29]/70 rounded-[6px] hover:bg-[#F4F2EC] hover:text-[#252A29] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A48658] md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current page title */}
        <div className="truncate">
          <h1 className="text-sm font-semibold text-[#252A29] tracking-tight truncate">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Global search & actions */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Desktop Search bar */}
        <form onSubmit={handleSearchSubmit} className="hidden sm:block relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#747A62]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search judgments, citations..."
            className="w-56 md:w-64 lg:w-80 pl-9 pr-3 py-1.5 text-xs bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] placeholder-[#252A29]/45 focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-all"
          />
        </form>

        {/* Mobile Search Toggle Button */}
        <div className="sm:hidden relative" ref={mobileSearchRef}>
          <button
            type="button"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
            className="p-2 text-[#252A29]/75 hover:text-[#252A29] hover:bg-[#F4F2EC] rounded-[6px] transition-colors"
            aria-label="Open search"
          >
            <Search className="w-4 h-4" />
          </button>

          {showMobileSearch && (
            <div className="absolute right-0 top-12 w-72 bg-[#FFFFFF] border border-[#DEDAD0] rounded-[8px] p-2 shadow-lg z-50">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-2.5 text-[#747A62]" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search judgments, citations..."
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 text-[#747A62] hover:text-[#252A29]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>
            </div>
          )}
        </div>

        {/* Notifications dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            className="relative p-2 text-[#252A29]/75 hover:text-[#252A29] hover:bg-[#F4F2EC] rounded-[6px] border border-transparent hover:border-[#DEDAD0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A48658] transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotif && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#713F42] rounded-full border border-[#FFFFFF]" />
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 mt-2 w-76 sm:w-80 bg-[#FFFFFF] border border-[#DEDAD0] rounded-[8px] shadow-lg p-3 z-50 space-y-2.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#DEDAD0]">
                <span className="text-xs font-semibold text-[#252A29]">Chambers Alerts</span>
                {unreadNotif && (
                  <button
                    type="button"
                    onClick={() => setUnreadNotif(false)}
                    className="text-[11px] text-[#A48658] hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
              {nextAlert ? (
                <div className="p-2.5 rounded-[6px] bg-[#F4F2EC] border border-[#DEDAD0] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-[#252A29] truncate">{nextAlert.caseTitle}</p>
                    <span className="text-[10px] text-[#A48658] font-mono shrink-0 ml-1">{nextAlert.date}</span>
                  </div>
                  <p className="text-[#747A62] text-[11px] leading-relaxed">
                    Listed in {nextAlert.courtRoom} ({nextAlert.time}) for {nextAlert.purpose}.
                  </p>
                </div>
              ) : (
                <div className="p-2.5 rounded-[6px] bg-[#F4F2EC] border border-[#DEDAD0] text-xs space-y-1">
                  <p className="font-semibold text-[#252A29]">Chambers Ingestion</p>
                  <p className="text-[#747A62] text-[11px] leading-relaxed">
                    Legal AI synthesis engine is active and ready for PDF document processing.
                  </p>
                </div>
              )}
              <div className="pt-1 text-center border-t border-[#DEDAD0]">
                <Link
                  to="/hearings"
                  onClick={() => setShowNotifDropdown(false)}
                  className="text-[11px] font-medium text-[#A48658] hover:underline"
                >
                  View full court cause list →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User profile menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2 p-1 sm:p-1.5 sm:pr-2.5 rounded-[6px] border border-transparent hover:border-[#DEDAD0] hover:bg-[#F4F2EC] text-[#252A29] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A48658] transition-all"
            aria-expanded={showUserDropdown}
          >
            <div className="w-7 h-7 rounded-[6px] bg-[#252A29] text-[#FFFFFF] flex items-center justify-center text-xs shrink-0">
              <User className="w-3.5 h-3.5 text-[#A48658]" />
            </div>
            <span className="hidden md:inline text-xs font-medium text-[#252A29] truncate max-w-[120px]">
              {shortName}
            </span>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] border border-[#DEDAD0] rounded-[8px] shadow-lg py-1.5 z-50">
              <div className="px-3.5 py-2.5 border-b border-[#DEDAD0] bg-[#F4F2EC]/60">
                <p className="text-xs font-semibold text-[#252A29] truncate">{profile.name}</p>
                <p className="text-[11px] text-[#747A62] truncate mt-0.5">{profile.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/settings"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center px-3.5 py-2 text-xs text-[#252A29] hover:bg-[#F4F2EC] transition-colors"
                >
                  <SettingsIcon className="w-3.5 h-3.5 mr-2 text-[#747A62]" />
                  Chambers Preferences
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full flex items-center px-3.5 py-2 text-xs text-[#713F42] hover:bg-[#713F42]/10 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
