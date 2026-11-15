import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Search,
  ArrowUpDown,
  ExternalLink,
  RotateCcw,
  Calendar,
  Inbox,
  Trash2,
  Bookmark,
} from 'lucide-react';
import { getCases, deleteCase } from '../services/dataStorage';
import { StatusBadge } from '../components/StatusBadge';

export function CasesLibrary() {
  const navigate = useNavigate();

  // Load from persistent localStorage
  const [cases, setCases] = useState(() => getCases());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCourt, setSelectedCourt] = useState('All');
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');

  const courtsList = useMemo(() => {
    const list = Array.from(new Set(cases.map((c) => c.court).filter(Boolean)));
    return ['All', ...list];
  }, [cases]);

  const filteredCases = useMemo(() => {
    return cases
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          (item.title && item.title.toLowerCase().includes(query)) ||
          (item.caseNumber && item.caseNumber.toLowerCase().includes(query)) ||
          (item.court && item.court.toLowerCase().includes(query)) ||
          (item.petitioner && item.petitioner.toLowerCase().includes(query)) ||
          (item.respondent && item.respondent.toLowerCase().includes(query));

        const matchesStatus =
          selectedStatus === 'All' || item.status === selectedStatus;

        const matchesCourt =
          selectedCourt === 'All' || item.court === selectedCourt;

        const matchesBookmarked = !bookmarkedOnly || Boolean(item.isSaved);

        return matchesQuery && matchesStatus && matchesCourt && matchesBookmarked;
      })
      .sort((a, b) => {
        const dateA = a.nextHearing && !a.nextHearing.includes('None') ? a.nextHearing : '9999-99-99';
        const dateB = b.nextHearing && !b.nextHearing.includes('None') ? b.nextHearing : '9999-99-99';

        return sortOrder === 'asc'
          ? dateA.localeCompare(dateB)
          : dateB.localeCompare(dateA);
      });
  }, [cases, searchQuery, selectedStatus, selectedCourt, bookmarkedOnly, sortOrder]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setSelectedCourt('All');
    setBookmarkedOnly(false);
    setSortOrder('asc');
  };

  const handleDelete = (id, title, e) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete case file:\n"${title}"?\n\nThis will also remove all scheduled hearings for this matter.`)) {
      deleteCase(id);
      setCases(getCases());
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 pb-4 border-b border-[#DEDAD0]">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#252A29] tracking-tight">
            Case Docket Matters
          </h2>
          <p className="text-xs sm:text-sm text-[#747A62] mt-1 font-serif italic">
            Representation briefs, court dockets, cited legal authorities, and listing history.
          </p>
        </div>

        <Link
          to="/cases/new"
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all hover:-translate-y-0.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5 text-[#A48658]" />
          Add Case File
        </Link>
      </div>

      {cases.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-12 text-center space-y-4 max-w-lg mx-auto my-8 shadow-2xs">
          <div className="w-14 h-14 mx-auto rounded-[8px] bg-[#F4F2EC] border border-[#DEDAD0] flex items-center justify-center text-[#252A29]">
            <Inbox className="w-7 h-7 text-[#747A62]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-[#252A29]">No active cases registered</h3>
            <p className="text-xs text-[#747A62] max-w-sm mx-auto leading-relaxed">
              Create a case file to track client matters, party representations, upcoming hearings, and precedent judgments.
            </p>
          </div>
          <Link
            to="/cases/new"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 text-[#A48658]" />
            Register First Case
          </Link>
        </div>
      ) : (
        <>
          {/* Search and Filters Bar */}
          <div className="bg-[#FFFFFF] p-4 rounded-[8px] border border-[#DEDAD0] space-y-3 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="relative lg:col-span-2">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#747A62]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, case number, party, or court..."
                  className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] placeholder-[#252A29]/45 focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-all"
                />
              </div>

              <div>
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

              <div>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active Docket</option>
                  <option value="Pending">Pending Evidence</option>
                  <option value="Closed">Disposed / Closed</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-[#DEDAD0] text-xs text-[#747A62]">
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span>
                  Showing <strong className="text-[#252A29] font-mono">{filteredCases.length}</strong> of{' '}
                  <span className="font-mono">{cases.length}</span> active cases
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

                {(searchQuery || selectedStatus !== 'All' || selectedCourt !== 'All' || bookmarkedOnly) && (
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
                Hearing Date: {sortOrder === 'asc' ? 'Earliest first' : 'Latest first'}
              </button>
            </div>
          </div>

          {/* Cases Table */}
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] shadow-2xs overflow-hidden">
            {filteredCases.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <Briefcase className="w-8 h-8 text-[#747A62] mx-auto opacity-75" />
                <h3 className="text-sm font-semibold text-[#252A29]">No cases match your filters</h3>
                <p className="text-xs text-[#747A62]">
                  Try modifying your search criteria or resetting filters.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[4px] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC]"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#DEDAD0] bg-[#F4F2EC]/75 text-[11px] font-mono uppercase tracking-wider text-[#747A62]">
                      <th className="py-3 px-5 font-medium">Case Title & Docket</th>
                      <th className="py-3 px-5 font-medium">Court</th>
                      <th className="py-3 px-5 font-medium">Parties Involved</th>
                      <th className="py-3 px-5 font-medium whitespace-nowrap">Next Hearing</th>
                      <th className="py-3 px-5 font-medium whitespace-nowrap">Status</th>
                      <th className="py-3 px-5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DEDAD0] text-xs">
                    {filteredCases.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#F4F2EC]/50 transition-colors cursor-pointer group"
                        onClick={() => navigate(`/cases/${item.id}`)}
                      >
                        <td className="py-4 px-5">
                          <p className="font-semibold text-[#252A29] group-hover:text-[#A48658] transition-colors">
                            {item.title}
                          </p>
                          <p className="font-mono text-[11px] text-[#A48658] mt-0.5">
                            {item.caseNumber}
                          </p>
                        </td>
                        <td className="py-4 px-5 text-[#252A29] font-medium">
                          {item.court}
                        </td>
                        <td className="py-4 px-5 text-[#252A29]">
                          <p className="font-medium">{item.petitioner}</p>
                          <p className="text-[11px] text-[#747A62] italic">vs. {item.respondent}</p>
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap">
                          {item.nextHearing && !item.nextHearing.includes('None') ? (
                            <div className="flex items-center text-xs font-semibold text-[#713F42]">
                              <Calendar className="w-3.5 h-3.5 mr-1 text-[#713F42]" />
                              <span>{item.nextHearing}</span>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#747A62]">Not Scheduled</span>
                          )}
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap">
                          <StatusBadge status={item.status} />
                        </td>
                        <td
                          className="py-4 px-5 text-right whitespace-nowrap space-x-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Link
                            to={`/cases/${item.id}`}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-[4px] border border-[#DEDAD0] bg-[#FFFFFF] hover:bg-[#F4F2EC] hover:border-[#A48658] text-[#252A29] transition-all"
                          >
                            Case File <ExternalLink className="w-3 h-3 ml-1 text-[#747A62]" />
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(item.id, item.title, e)}
                            className="inline-flex items-center p-1.5 text-xs text-[#747A62] hover:text-[#713F42] hover:bg-[#713F42]/10 rounded-[4px] transition-colors"
                            title="Delete case file"
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
