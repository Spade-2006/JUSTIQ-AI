import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  ArrowUpDown,
  Clock,
  MapPin,
  RotateCcw,
  ChevronRight,
  Inbox,
  Trash2,
} from 'lucide-react';
import { getHearings, deleteHearing } from '../services/dataStorage';
import { StatusBadge } from '../components/StatusBadge';

export function HearingsManagement() {
  const navigate = useNavigate();

  // Load from persistent localStorage
  const [hearings, setHearings] = useState(() => getHearings());

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' = earliest first, 'desc' = latest first
  const [activeDateFilter, setActiveDateFilter] = useState('All');

  // Distinct dates for the calendar overview strip
  const dateOverviewList = useMemo(() => {
    const dates = Array.from(new Set(hearings.map((h) => h.date).filter(Boolean))).sort();
    return dates;
  }, [hearings]);

  // Filter and sort hearings
  const filteredHearings = useMemo(() => {
    return hearings
      .filter((item) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          (item.caseTitle && item.caseTitle.toLowerCase().includes(query)) ||
          (item.caseNumber && item.caseNumber.toLowerCase().includes(query)) ||
          (item.court && item.court.toLowerCase().includes(query)) ||
          (item.purpose && item.purpose.toLowerCase().includes(query));

        const matchesStatus =
          selectedStatus === 'All' ||
          (item.status || '').toLowerCase() === selectedStatus.toLowerCase();

        const matchesDate =
          activeDateFilter === 'All' || item.date === activeDateFilter;

        return matchesQuery && matchesStatus && matchesDate;
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date || '9999-99-99'} ${a.time || '00:00'}`).getTime();
        const dateB = new Date(`${b.date || '9999-99-99'} ${b.time || '00:00'}`).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [hearings, searchQuery, selectedStatus, activeDateFilter, sortOrder]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('All');
    setActiveDateFilter('All');
    setSortOrder('asc');
  };

  const handleDelete = (id, caseTitle, date, e) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete hearing listing for:\n"${caseTitle}" on ${date}?`)) {
      deleteHearing(id);
      setHearings(getHearings());
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-4 pb-4 border-b border-[#DEDAD0]">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#252A29] tracking-tight">
            Hearings & Court Listings
          </h2>
          <p className="text-xs sm:text-sm text-[#747A62] mt-1 font-serif italic">
            Monitor court appearances, daily cause lists, courtroom venues, and proceedings outcomes.
          </p>
        </div>

        <Link
          to="/hearings/new"
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all hover:-translate-y-0.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5 text-[#A48658]" />
          Schedule Hearing
        </Link>
      </div>

      {hearings.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-12 text-center space-y-4 max-w-lg mx-auto my-8 shadow-2xs">
          <div className="w-14 h-14 mx-auto rounded-[8px] bg-[#F4F2EC] border border-[#DEDAD0] flex items-center justify-center text-[#252A29]">
            <Inbox className="w-7 h-7 text-[#747A62]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-[#252A29]">No hearings scheduled</h3>
            <p className="text-xs text-[#747A62] max-w-sm mx-auto leading-relaxed">
              No courtroom appearances or proceedings entries are logged in your calendar. Link hearing dates to your registered case matters.
            </p>
          </div>
          <Link
            to="/hearings/new"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 text-[#A48658]" />
            Schedule Your First Hearing
          </Link>
        </div>
      ) : (
        <>
          {/* Calendar Overview Strip */}
          <div className="bg-[#FFFFFF] p-4 rounded-[8px] border border-[#DEDAD0] space-y-2.5 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-[#747A62]">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#252A29] flex items-center font-semibold">
                <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-[#713F42]" />
                Cause List Date Quick-Select
              </span>
              {activeDateFilter !== 'All' && (
                <button
                  type="button"
                  onClick={() => setActiveDateFilter('All')}
                  className="text-[#A48658] hover:underline text-xs font-medium"
                >
                  Show all dates
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
              <button
                type="button"
                onClick={() => setActiveDateFilter('All')}
                className={`px-3 py-1.5 rounded-[6px] text-xs font-medium whitespace-nowrap border transition-all ${
                  activeDateFilter === 'All'
                    ? 'bg-[#252A29] text-[#FFFFFF] border-[#252A29] shadow-2xs'
                    : 'bg-[#F4F2EC] text-[#252A29] border-[#DEDAD0] hover:bg-[#FFFFFF]'
                }`}
              >
                All Dates ({hearings.length})
              </button>

              {dateOverviewList.map((d) => {
                const count = hearings.filter((h) => h.date === d).length;
                const isSelected = activeDateFilter === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setActiveDateFilter(d)}
                    className={`px-3 py-1.5 rounded-[6px] text-xs font-medium whitespace-nowrap border transition-all flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-[#713F42] text-[#FFFFFF] border-[#713F42] shadow-2xs'
                        : 'bg-[#F4F2EC] text-[#252A29] border-[#DEDAD0] hover:bg-[#FFFFFF]'
                    }`}
                  >
                    <span>{d}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-[3px] text-[10px] font-mono ${
                        isSelected ? 'bg-white/20 text-[#FFFFFF]' : 'bg-[#DEDAD0] text-[#252A29]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-[#FFFFFF] p-4 rounded-[8px] border border-[#DEDAD0] space-y-3 shadow-2xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search */}
              <div className="relative sm:col-span-2">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#747A62]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by case title, case number, court, or purpose..."
                  className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] placeholder-[#252A29]/45 focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-colors"
                >
                  <option value="All">All Statuses</option>
                  <option value="Upcoming">Upcoming / Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Adjourned">Adjourned</option>
                </select>
              </div>
            </div>

            {/* Filter Summary & Date Sort */}
            <div className="flex flex-wrap items-center justify-between pt-2.5 border-t border-[#DEDAD0] text-xs text-[#747A62]">
              <div className="flex items-center space-x-2">
                <span>
                  Showing <strong className="text-[#252A29] font-mono">{filteredHearings.length}</strong> of{' '}
                  <span className="font-mono">{hearings.length}</span> listed hearings
                </span>
                {(searchQuery || selectedStatus !== 'All' || activeDateFilter !== 'All') && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center text-xs text-[#A48658] hover:underline ml-2"
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
                Sort: {sortOrder === 'asc' ? 'Earliest first' : 'Latest first'}
              </button>
            </div>
          </div>

          {/* Hearings Table */}
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] shadow-2xs overflow-hidden">
            {filteredHearings.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <CalendarIcon className="w-8 h-8 text-[#747A62] mx-auto opacity-75" />
                <h3 className="text-sm font-semibold text-[#252A29]">No matching hearings found</h3>
                <p className="text-xs text-[#747A62] max-w-sm mx-auto">
                  No records match your filters. Try resetting the search or date filter.
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
                      <th className="py-3 px-5 font-medium">Court & Venue</th>
                      <th className="py-3 px-5 font-medium whitespace-nowrap">Hearing Date & Time</th>
                      <th className="py-3 px-5 font-medium">Purpose</th>
                      <th className="py-3 px-5 font-medium whitespace-nowrap">Status</th>
                      <th className="py-3 px-5 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#DEDAD0] text-xs">
                    {filteredHearings.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#F4F2EC]/50 transition-colors cursor-pointer group"
                        onClick={() => navigate(`/hearings/${item.id}`)}
                      >
                        <td className="py-4 px-5">
                          <p className="font-semibold text-[#252A29] group-hover:text-[#A48658] transition-colors">
                            {item.caseTitle}
                          </p>
                          <p className="font-mono text-[11px] text-[#A48658] mt-0.5">
                            {item.caseNumber}
                          </p>
                        </td>
                        <td className="py-4 px-5 text-[#252A29]">
                          <p className="font-medium text-[#252A29]">{item.court}</p>
                          <p className="text-[11px] text-[#747A62] flex items-center mt-0.5">
                            <MapPin className="w-3 h-3 mr-1 text-[#747A62]" />
                            {item.courtRoom}
                          </p>
                        </td>
                        <td className="py-4 px-5 whitespace-nowrap text-[#252A29]">
                          <div className="flex items-center font-semibold text-[#713F42]">
                            <CalendarIcon className="w-3.5 h-3.5 mr-1 text-[#713F42]" />
                            <span>{item.date}</span>
                          </div>
                          <div className="flex items-center text-[11px] text-[#747A62] mt-0.5">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{item.time}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-[#252A29]">
                          <p className="font-medium text-[#252A29] line-clamp-1">{item.purpose}</p>
                          {item.notes && (
                            <p className="text-[11px] text-[#747A62] line-clamp-1 mt-0.5">
                              {item.notes}
                            </p>
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
                            to={`/hearings/${item.id}`}
                            className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-[4px] border border-[#DEDAD0] bg-[#FFFFFF] hover:bg-[#F4F2EC] hover:border-[#A48658] text-[#252A29] transition-all"
                          >
                            Details <ChevronRight className="w-3 h-3 ml-0.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(item.id, item.caseTitle, item.date, e)}
                            className="inline-flex items-center p-1.5 text-xs text-[#747A62] hover:text-[#713F42] hover:bg-[#713F42]/10 rounded-[4px] transition-colors"
                            title="Delete hearing listing"
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
