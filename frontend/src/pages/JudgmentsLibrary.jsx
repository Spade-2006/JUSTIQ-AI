import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Upload,
  Search,
  ArrowUpDown,
  FileText,
  ExternalLink,
  RotateCcw,
  Inbox,
  Trash2,
  Bookmark,
} from 'lucide-react';
import { getJudgments, deleteJudgment } from '../services/dataStorage';
import { StatusBadge } from '../components/StatusBadge';

export function JudgmentsLibrary() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Load judgments from localStorage
  const [judgments, setJudgments] = useState(() => getJudgments());

  const queryParam = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(() => queryParam);
  const [selectedCourt, setSelectedCourt] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = newest first, 'asc' = oldest first

  // Unique court list for filter dropdown
  const courtsList = useMemo(() => {
    const list = Array.from(new Set(judgments.map((j) => j.court).filter(Boolean)));
    return ['All', ...list];
  }, [judgments]);

  // Filter and sort judgments
  const filteredJudgments = useMemo(() => {
    return judgments
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          (item.title && item.title.toLowerCase().includes(query)) ||
          (item.citation && item.citation.toLowerCase().includes(query)) ||
          (item.court && item.court.toLowerCase().includes(query));

        const matchesCourt =
          selectedCourt === 'All' || item.court === selectedCourt;

        const matchesStatus =
          selectedStatus === 'All' || item.status === selectedStatus;

        const matchesBookmarked = !bookmarkedOnly || Boolean(item.isSaved);

        return matchesQuery && matchesCourt && matchesStatus && matchesBookmarked;
      })
      .sort((a, b) => {
        const dateA = new Date(a.judgmentDate || 0).getTime();
        const dateB = new Date(b.judgmentDate || 0).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [judgments, searchQuery, selectedCourt, selectedStatus, bookmarkedOnly, sortOrder]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCourt('All');
    setSelectedStatus('All');
    setBookmarkedOnly(false);
    setSortOrder('desc');
  };

  const handleDelete = (id, title, e) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete judgment record:\n"${title}"?\n\nThis will remove it from all case references.`)) {
      deleteJudgment(id);
      setJudgments(getJudgments());
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Upload Action */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 pb-4 border-b border-[#DEDAD0]">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#252A29] tracking-tight">
            Judgment Library
          </h2>
          <p className="text-xs sm:text-sm text-[#747A62] mt-1 font-serif italic">
            District court repository of indexed judgments, trial court decrees, orders, and synthesized legal briefs.
          </p>
        </div>

        <Link
          to="/judgments/upload"
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all hover:-translate-y-0.5 self-start sm:self-auto"
        >
          <Upload className="w-3.5 h-3.5 mr-2 text-[#A48658]" />
          Upload Judgment
        </Link>
      </div>

      {/* Main Container */}
      {judgments.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-12 text-center space-y-4 max-w-lg mx-auto my-8 shadow-2xs">
          <div className="w-14 h-14 mx-auto rounded-[8px] bg-[#F4F2EC] border border-[#DEDAD0] flex items-center justify-center text-[#252A29]">
            <Inbox className="w-7 h-7 text-[#747A62]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-[#252A29]">No judgments in archive</h3>
            <p className="text-xs text-[#747A62] max-w-sm mx-auto leading-relaxed">
              Upload PDF copies of court judgments to extract legal reasoning, ratio decidendi, and statutory references.
            </p>
          </div>
          <Link
            to="/judgments/upload"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all"
          >
            <Upload className="w-3.5 h-3.5 mr-2 text-[#A48658]" />
            Upload First Judgment
          </Link>
        </div>
      ) : (
        <>
          {/* Search and Filters Bar */}
          <div className="bg-[#FFFFFF] p-4 rounded-[8px] border border-[#DEDAD0] space-y-3 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search Input */}
              <div className="relative lg:col-span-2">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#747A62]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, citation, or court..."
                  className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] placeholder-[#252A29]/45 focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-all"
                />
              </div>

              {/* Court Filter */}
              <div className="relative">
                <select
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
                >
                  {courtsList.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All District Divisions' : c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Analysis Status Filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
                >
                  <option value="All">All Analysis Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Processing">Processing</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Filter Summary & Sort Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#DEDAD0] text-xs text-[#747A62]">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span>
                  Showing <strong className="text-[#252A29] font-mono">{filteredJudgments.length}</strong> of{' '}
                  <span className="font-mono">{judgments.length}</span> archived rulings
                </span>

                <button
                  type="button"
                  onClick={() => setBookmarkedOnly(!bookmarkedOnly)}
                  className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium border transition-colors ${
                    bookmarkedOnly
                      ? 'bg-[#A48658]/15 text-[#685333] border-[#A48658]/50'
                      : 'bg-[#F4F2EC] text-[#747A62] border-[#DEDAD0] hover:text-[#252A29]'
                  }`}
                >
                  <Bookmark className={`w-3 h-3 mr-1 ${bookmarkedOnly ? 'fill-current text-[#A48658]' : ''}`} />
                  Bookmarked Only
                </button>

                {(searchQuery || selectedCourt !== 'All' || selectedStatus !== 'All' || bookmarkedOnly) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center text-xs text-[#A48658] hover:underline ml-1"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" /> Reset filters
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="inline-flex items-center text-xs text-[#252A29] hover:text-[#A48658] font-medium py-1 px-2.5 rounded-[4px] hover:bg-[#F4F2EC] transition-colors"
              >
                <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-[#747A62]" />
                Sort: {sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}
              </button>
            </div>
          </div>

          {/* Judgments Table */}
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] shadow-2xs overflow-hidden">
            {filteredJudgments.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <FileText className="w-8 h-8 text-[#747A62] mx-auto opacity-75" />
                <h3 className="text-sm font-semibold text-[#252A29]">No judgments match your filter criteria</h3>
                <p className="text-xs text-[#747A62]">
                  Try modifying your search keywords or clearing active filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[4px] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC]"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#DEDAD0] bg-[#F4F2EC]/75 text-[11px] font-mono uppercase tracking-wider text-[#747A62]">
                      <th className="py-3 px-5 font-medium">Case Title & Citation</th>
                      <th className="py-3 px-5 font-medium">Court</th>
                      <th className="py-3 px-5 font-medium whitespace-nowrap">Judgment Date</th>
                      <th className="py-3 px-5 font-medium whitespace-nowrap">AI Status</th>
                      <th className="py-3 px-5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DEDAD0] text-xs">
                    {filteredJudgments.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#F4F2EC]/50 transition-colors cursor-pointer group"
                        onClick={() => navigate(`/judgments/${item.id}`)}
                      >
                        <td className="py-4 px-5">
                          <p className="font-semibold text-[#252A29] group-hover:text-[#A48658] transition-colors">
                            {item.title}
                          </p>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="font-mono text-[11px] text-[#A48658] font-medium">
                              {item.citation}
                            </span>
                            {item.fileName && (
                              <span className="text-[10px] text-[#747A62]">
                                · {item.fileName}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-5 text-[#252A29] font-medium">
                          {item.court}
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap font-mono text-[11px] text-[#747A62]">
                          {item.judgmentDate}
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap">
                          <StatusBadge status={item.status} />
                        </td>
                        <td
                          className="py-4 px-5 text-right whitespace-nowrap space-x-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            to={`/judgments/${item.id}`}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-[4px] border border-[#DEDAD0] bg-[#FFFFFF] hover:bg-[#F4F2EC] hover:border-[#A48658] text-[#252A29] transition-all"
                          >
                            View Analysis <ExternalLink className="w-3 h-3 ml-1 text-[#747A62]" />
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(item.id, item.title, e)}
                            className="inline-flex items-center p-1.5 text-xs text-[#747A62] hover:text-[#713F42] hover:bg-[#713F42]/10 rounded-[4px] transition-colors"
                            title="Delete judgment record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
