import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function PlaceholderPage({ title, description, primaryActionText, onPrimaryAction }) {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-[#DEDAD0] flex items-baseline justify-between">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#252A29] tracking-tight">{title}</h2>
          <p className="text-xs sm:text-sm text-[#747A62] mt-1 font-serif italic">{description}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center text-xs font-medium text-[#747A62] hover:text-[#252A29] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
        </Link>
      </div>

      <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-12 text-center max-w-lg mx-auto my-12 space-y-4 shadow-2xs">
        <div className="w-12 h-12 mx-auto rounded-[8px] bg-[#F4F2EC] border border-[#DEDAD0] flex items-center justify-center text-[#252A29] font-editorial text-lg font-bold">
          §
        </div>
        <div>
          <h3 className="font-editorial text-base font-bold text-[#252A29]">{title} Module</h3>
          <p className="text-xs text-[#747A62] mt-1.5 max-w-sm mx-auto leading-relaxed">
            This module route is registered and ready for advanced legal intelligence implementation in the next chambers release.
          </p>
        </div>
        {primaryActionText && (
          <button
            type="button"
            onClick={onPrimaryAction || (() => alert(`Action triggered for ${title}`))}
            className="px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all"
          >
            {primaryActionText}
          </button>
        )}
      </div>
    </div>
  );
}
