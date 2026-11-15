import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Upload,
  Plus,
  ArrowRight,
  Clock,
  ExternalLink,
  Inbox,
  Sparkles,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import { getDashboardMetrics } from '../services/dataStorage';
import { StatusBadge } from '../components/StatusBadge';

export function Dashboard() {
  const navigate = useNavigate();
  const [metrics] = useState(() => getDashboardMetrics());

  const { stats, recentJudgments, upcomingHearingsList } = metrics;
  const isWorkspaceEmpty = stats.totalJudgments === 0 && stats.activeCases === 0;

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 pb-4 border-b border-[#DEDAD0]">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#252A29] tracking-tight">
            Chambers Overview
          </h2>
          <p className="text-xs sm:text-sm text-[#747A62] mt-0.5 font-serif italic">
            District court litigation docket, indexed trial judgments, and courtroom cause list schedules.
          </p>
        </div>

        {/* Primary Actions with prominent, consistent styling */}
        <div className="flex items-center gap-2.5">
          <Link
            to="/judgments/upload"
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all"
          >
            <Upload className="w-3.5 h-3.5 mr-2 text-[#A48658]" />
            Upload Judgment
          </Link>
          <Link
            to="/cases/new"
            className="inline-flex items-center justify-center px-3.5 py-2 text-xs font-medium rounded-[6px] bg-[#FFFFFF] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC] hover:border-[#A48658]/60 shadow-2xs transition-all"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 text-[#747A62]" />
            Add Case
          </Link>
        </div>
      </div>

      {/* Four Consistently Designed Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Judgments */}
        <div className="bg-[#FFFFFF] p-5 rounded-[8px] border border-[#DEDAD0] shadow-2xs flex flex-col justify-between hover:border-[#A48658]/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#747A62]">
              Total Judgments
            </span>
            <div className="w-8 h-8 rounded-[6px] bg-[#F4F2EC] border border-[#DEDAD0] flex items-center justify-center text-[#747A62]">
              <FileText className="w-4 h-4 text-[#A48658]" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#252A29] tracking-tight">
              {stats.totalJudgments}
            </span>
            <Link
              to="/judgments"
              className="text-xs text-[#A48658] font-medium hover:underline flex items-center"
            >
              View library <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Metric 2: Active Cases */}
        <div className="bg-[#FFFFFF] p-5 rounded-[8px] border border-[#DEDAD0] shadow-2xs flex flex-col justify-between hover:border-[#A48658]/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#747A62]">
              Active Cases
            </span>
            <div className="w-8 h-8 rounded-[6px] bg-[#F4F2EC] border border-[#DEDAD0] flex items-center justify-center text-[#747A62]">
              <Briefcase className="w-4 h-4 text-[#747A62]" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#252A29] tracking-tight">
              {stats.activeCases}
            </span>
            <Link
              to="/cases"
              className="text-xs text-[#A48658] font-medium hover:underline flex items-center"
            >
              View docket <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Metric 3: Upcoming Hearings */}
        <div className="bg-[#FFFFFF] p-5 rounded-[8px] border border-[#DEDAD0] shadow-2xs flex flex-col justify-between hover:border-[#713F42]/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#747A62]">
              Upcoming Hearings
            </span>
            <div className="w-8 h-8 rounded-[6px] bg-[#713F42]/10 border border-[#713F42]/25 flex items-center justify-center text-[#713F42]">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#713F42] tracking-tight">
              {stats.upcomingHearings}
            </span>
            <Link
              to="/hearings"
              className="text-xs text-[#713F42] font-semibold hover:underline flex items-center"
            >
              Cause list <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
        </div>

        {/* Metric 4: AI Summaries */}
        <div className="bg-[#FFFFFF] p-5 rounded-[8px] border border-[#DEDAD0] shadow-2xs flex flex-col justify-between hover:border-[#A48658]/50 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#747A62]">
              AI Summaries
            </span>
            <div className="w-8 h-8 rounded-[6px] bg-[#A48658]/15 border border-[#A48658]/35 flex items-center justify-center text-[#A48658]">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-[#252A29] tracking-tight">
              {stats.completedSummaries}
            </span>
            <span className="text-xs text-[#747A62] font-medium">
              processed
            </span>
          </div>
        </div>
      </div>

      {/* Getting Started Guide when Workspace has no records */}
      {isWorkspaceEmpty && (
        <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#DEDAD0]">
            <div className="flex items-center space-x-2.5">
              <HelpCircle className="w-5 h-5 text-[#A48658]" />
              <h3 className="font-editorial text-base font-bold text-[#252A29]">
                Getting Started with JUSTIQ Chambers
              </h3>
            </div>
            <span className="text-xs text-[#747A62]">Initial Setup Guide</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#F4F2EC]/60 rounded-[6px] border border-[#DEDAD0] space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#252A29] text-[#FFFFFF] text-xs font-semibold flex items-center justify-center">1</span>
              <h4 className="text-xs font-bold text-[#252A29]">Upload a Judgment</h4>
              <p className="text-[11px] text-[#747A62] leading-relaxed">
                Add court orders or law reports in PDF format to extract legal propositions and citations.
              </p>
              <Link to="/judgments/upload" className="inline-block text-xs font-semibold text-[#A48658] hover:underline pt-1">
                Upload now &rarr;
              </Link>
            </div>

            <div className="p-4 bg-[#F4F2EC]/60 rounded-[6px] border border-[#DEDAD0] space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#252A29] text-[#FFFFFF] text-xs font-semibold flex items-center justify-center">2</span>
              <h4 className="text-xs font-bold text-[#252A29]">Register a Case File</h4>
              <p className="text-[11px] text-[#747A62] leading-relaxed">
                Create representation briefs with petitioner, respondent, court hall, and matter details.
              </p>
              <Link to="/cases/new" className="inline-block text-xs font-semibold text-[#A48658] hover:underline pt-1">
                Add case &rarr;
              </Link>
            </div>

            <div className="p-4 bg-[#F4F2EC]/60 rounded-[6px] border border-[#DEDAD0] space-y-2">
              <span className="w-6 h-6 rounded-full bg-[#252A29] text-[#FFFFFF] text-xs font-semibold flex items-center justify-center">3</span>
              <h4 className="text-xs font-bold text-[#252A29]">Schedule Hearings</h4>
              <p className="text-[11px] text-[#747A62] leading-relaxed">
                Log cause list dates, appearance venues, and preparation directions to track next steps.
              </p>
              <Link to="/hearings/new" className="inline-block text-xs font-semibold text-[#A48658] hover:underline pt-1">
                Schedule hearing &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Balanced Two-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Judgments */}
        <div className="lg:col-span-2 bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] shadow-2xs flex flex-col">
          <div className="px-5 py-3.5 border-b border-[#DEDAD0] flex items-center justify-between bg-[#F4F2EC]/50">
            <div className="flex items-center space-x-2.5">
              <FileText className="w-4 h-4 text-[#A48658]" />
              <h3 className="font-editorial text-sm font-bold text-[#252A29] uppercase tracking-wide">
                Recent Judgment Filings
              </h3>
            </div>
            {recentJudgments.length > 0 && (
              <Link
                to="/judgments"
                className="text-xs text-[#A48658] hover:text-[#252A29] flex items-center font-medium transition-colors"
              >
                All Judgments <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            )}
          </div>

          <div className="flex-1 overflow-x-auto">
            {recentJudgments.length === 0 ? (
              <div className="p-8 text-center space-y-2.5">
                <Inbox className="w-8 h-8 text-[#747A62] mx-auto opacity-70" />
                <p className="text-xs font-semibold text-[#252A29]">No judgments uploaded yet</p>
                <p className="text-[11px] text-[#747A62] max-w-sm mx-auto">
                  Upload court copies to index legal issues, ratio decidendi, and precedent citations.
                </p>
                <Link
                  to="/judgments/upload"
                  className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5 text-[#A48658]" />
                  Upload Judgment
                </Link>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#DEDAD0] bg-[#F4F2EC]/75 text-[11px] uppercase tracking-wider text-[#747A62]">
                    <th className="py-2.5 px-4 font-semibold">Case Title & Citation</th>
                    <th className="py-2.5 px-4 font-semibold">Court</th>
                    <th className="py-2.5 px-4 font-semibold">Date</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                    <th className="py-2.5 px-4 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DEDAD0] text-xs">
                  {recentJudgments.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-[#F4F2EC]/60 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/judgments/${item.id}`)}
                    >
                      <td className="py-3 px-4">
                        <p className="font-semibold text-[#252A29] group-hover:text-[#A48658] transition-colors line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#A48658] mt-0.5">
                          {item.citation}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-[#252A29] font-medium">
                        {item.court}
                      </td>
                      <td className="py-3 px-4 text-[11px] text-[#747A62] whitespace-nowrap">
                        {item.judgmentDate}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <Link
                          to={`/judgments/${item.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-[4px] border border-[#DEDAD0] bg-[#FFFFFF] hover:bg-[#F4F2EC] hover:border-[#A48658] text-[#252A29] transition-all"
                        >
                          View <ExternalLink className="w-3 h-3 ml-1 text-[#747A62]" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Upcoming Hearings */}
        <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] shadow-2xs flex flex-col">
          <div className="px-5 py-3.5 border-b border-[#DEDAD0] flex items-center justify-between bg-[#F4F2EC]/50">
            <div className="flex items-center space-x-2.5">
              <Calendar className="w-4 h-4 text-[#713F42]" />
              <h3 className="font-editorial text-sm font-bold text-[#252A29] uppercase tracking-wide">
                Upcoming Hearings
              </h3>
            </div>
            <Link
              to="/hearings"
              className="text-xs text-[#713F42] hover:text-[#252A29] font-medium"
            >
              All Listings
            </Link>
          </div>

          <div className="p-4 flex-1">
            {upcomingHearingsList.length === 0 ? (
              <div className="p-8 text-center space-y-2.5">
                <Calendar className="w-8 h-8 text-[#747A62] mx-auto opacity-70" />
                <p className="text-xs font-semibold text-[#252A29]">No pending hearings</p>
                <p className="text-[11px] text-[#747A62]">
                  No upcoming court listings scheduled on your docket.
                </p>
                <Link
                  to="/hearings/new"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[6px] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC] mt-1"
                >
                  <Plus className="w-3 h-3 mr-1 text-[#747A62]" /> Schedule Hearing
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5">
                {upcomingHearingsList.map((hearing) => (
                  <div
                    key={hearing.id}
                    onClick={() => navigate(`/hearings/${hearing.id}`)}
                    className="p-3 rounded-[6px] border border-[#DEDAD0] hover:border-[#713F42]/50 bg-[#F4F2EC]/40 hover:bg-[#FFFFFF] transition-all cursor-pointer space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#713F42] flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-[#713F42]" />
                        {hearing.date} · {hearing.time}
                      </span>
                      <StatusBadge status={hearing.status} />
                    </div>

                    <p className="text-xs font-semibold text-[#252A29] line-clamp-1">
                      {hearing.caseTitle}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[#747A62] pt-1 border-t border-[#DEDAD0]/60">
                      <span className="text-[#A48658] font-medium">{hearing.caseNumber}</span>
                      <span>{hearing.courtRoom || hearing.court}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
