import React, { useState } from 'react';
import {
  User,
  Cpu,
  Save,
  CheckCircle2,
  Lock,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, saveUserProfile } from '../services/dataStorage';

export function Settings() {
  const navigate = useNavigate();

  // Load persistent user profile
  const [profile, setProfile] = useState(() => getUserProfile());

  // Profile preferences
  const [name, setName] = useState(profile.name || 'Adv. Rajesh Sharma');
  const [email, setEmail] = useState(profile.email || 'sharma.legal@delhibar.in');
  const [phone, setPhone] = useState(profile.phone || '+91 98102 34567');
  const [barNumber, setBarNumber] = useState(profile.barNumber || 'D/1482/2012');
  const [barAssociation, setBarAssociation] = useState(profile.barAssociation || 'Tis Hazari District Court Bar Association');
  const [primaryPractice, setPrimaryPractice] = useState(profile.primaryPractice || 'Civil & Criminal Litigation');

  // AI & research preferences
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [detailLevel, setDetailLevel] = useState('standard');
  const [autoExtractCitations, setAutoExtractCitations] = useState(true);
  const [emailHearingReminders, setEmailHearingReminders] = useState(true);

  // Security password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Status feedback
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      ...profile,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      barNumber: barNumber.trim(),
      barAssociation: barAssociation.trim(),
      primaryPractice: primaryPractice.trim(),
    };
    saveUserProfile(updated);
    setProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      alert('Please fill in both current and new password fields.');
      return;
    }
    alert('Security credentials updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
  };

  const handleSignOut = () => {
    if (confirm('Are you sure you want to sign out of JUSTIQ?')) {
      localStorage.removeItem('justiq_auth_user');
      navigate('/login');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Title */}
      <div className="pb-4 border-b border-[#DEDAD0] flex items-baseline justify-between">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#252A29] tracking-tight">
            Account & Pipeline Preferences
          </h2>
          <p className="text-xs sm:text-sm text-[#747A62] mt-1 font-serif italic">
            Manage your advocate credentials, AI model pipelines, and chambers settings.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-[6px] border border-[#713F42]/30 text-[#713F42] bg-[#713F42]/10 hover:bg-[#713F42]/20 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 mr-1.5 text-[#713F42]" /> Sign Out
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-[6px] bg-[#747A62]/10 border border-[#747A62]/35 text-[#252A29] text-xs flex items-center space-x-2.5 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-[#747A62] shrink-0" />
          <span className="font-medium">Advocate profile and chambers preferences have been saved and applied across the workspace.</span>
        </div>
      )}

      {/* 1. Advocate Profile Information */}
      <form onSubmit={handleSaveProfile} className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-6 space-y-4 shadow-2xs">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-[#DEDAD0]">
          <User className="w-4 h-4 text-[#A48658]" />
          <h3 className="font-editorial text-sm font-bold text-[#252A29] uppercase tracking-wide">
            1. Advocate Profile & Bar Council Credentials
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#252A29] font-medium mb-1">Full Name & Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>

          <div>
            <label className="block text-[#252A29] font-medium mb-1">Official Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>

          <div>
            <label className="block text-[#252A29] font-medium mb-1">Contact Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>

          <div>
            <label className="block text-[#252A29] font-medium mb-1">
              Bar Council Enrollment Number
            </label>
            <input
              type="text"
              value={barNumber}
              onChange={(e) => setBarNumber(e.target.value)}
              className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>

          <div>
            <label className="block text-[#252A29] font-medium mb-1">Bar Association</label>
            <input
              type="text"
              value={barAssociation}
              onChange={(e) => setBarAssociation(e.target.value)}
              className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>

          <div>
            <label className="block text-[#252A29] font-medium mb-1">Primary Area of Practice</label>
            <input
              type="text"
              value={primaryPractice}
              onChange={(e) => setPrimaryPractice(e.target.value)}
              className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-[#DEDAD0]">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save Profile Details
          </button>
        </div>
      </form>

      {/* 2. AI Summarization & Research Preferences */}
      <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-6 space-y-4 shadow-2xs">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-[#DEDAD0]">
          <Cpu className="w-4 h-4 text-[#A48658]" />
          <h3 className="font-editorial text-sm font-bold text-[#252A29] uppercase tracking-wide">
            2. AI Legal Summarization Pipeline Engine
          </h3>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#252A29] font-medium mb-1">Pipeline Model</label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Legal Fast Briefing)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep Ratio Decidendi Analysis)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#252A29] font-medium mb-1">Summary Granularity</label>
              <select
                value={detailLevel}
                onChange={(e) => setDetailLevel(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
              >
                <option value="concise">Concise (1-Page Executive Brief)</option>
                <option value="standard">Standard (Comprehensive Rulings & Facts)</option>
                <option value="exhaustive">Exhaustive (Full Precedent Cross-Mapping)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 space-y-2.5 border-t border-[#DEDAD0]">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoExtractCitations}
                onChange={(e) => setAutoExtractCitations(e.target.checked)}
                className="w-4 h-4 text-[#252A29] rounded-[4px] border-[#DEDAD0]"
              />
              <span className="text-[#252A29] font-medium">
                Automatically extract cited district precedents, orders & relevant statutory sections
              </span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={emailHearingReminders}
                onChange={(e) => setEmailHearingReminders(e.target.checked)}
                className="w-4 h-4 text-[#252A29] rounded-[4px] border-[#DEDAD0]"
              />
              <span className="text-[#252A29] font-medium">
                Receive courtroom hearing alerts 24 hours prior to listing date
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* 3. Security & Password Update */}
      <form onSubmit={handlePasswordUpdate} className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-6 space-y-4 shadow-2xs">
        <div className="flex items-center space-x-2 pb-2.5 border-b border-[#DEDAD0]">
          <Lock className="w-4 h-4 text-[#A48658]" />
          <h3 className="font-editorial text-sm font-bold text-[#252A29] uppercase tracking-wide">
            3. Account Security & Credentials
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#252A29] font-medium mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>

          <div>
            <label className="block text-[#252A29] font-medium mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3 border-t border-[#DEDAD0]">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-[6px] border border-[#DEDAD0] bg-[#F4F2EC] text-[#252A29] hover:bg-[#FFFFFF] hover:border-[#A48658] transition-colors"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}
