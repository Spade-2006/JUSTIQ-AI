import React from 'react';

export function StatusBadge({ status }) {
  const normalized = (status || '').toLowerCase();

  // Premium, distinctive legal-tech status badge with refined tone
  let badgeStyle = 'bg-[#F4F2EC] text-[#252A29] border-[#DEDAD0]';
  let dotColor = 'bg-[#747A62]';

  if (normalized === 'completed' || normalized === 'success') {
    badgeStyle = 'bg-[#747A62]/10 text-[#474c3b] border-[#747A62]/35';
    dotColor = 'bg-[#747A62]';
  } else if (normalized === 'processing' || normalized === 'pending') {
    badgeStyle = 'bg-[#A48658]/12 text-[#685333] border-[#A48658]/35';
    dotColor = 'bg-[#A48658] animate-pulse';
  } else if (normalized === 'failed' || normalized === 'cancelled') {
    badgeStyle = 'bg-[#713F42]/10 text-[#713F42] border-[#713F42]/35';
    dotColor = 'bg-[#713F42]';
  } else if (normalized === 'upcoming' || normalized === 'scheduled' || normalized === 'active') {
    badgeStyle = 'bg-[#252A29]/8 text-[#252A29] border-[#252A29]/25';
    dotColor = 'bg-[#252A29]';
  } else if (normalized === 'adjourned' || normalized === 'rescheduled') {
    badgeStyle = 'bg-[#713F42]/12 text-[#713F42] border-[#713F42]/35';
    dotColor = 'bg-[#713F42]';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-[6px] text-[11px] font-medium border ${badgeStyle} tracking-wide transition-colors`}
    >
      <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  );
}
