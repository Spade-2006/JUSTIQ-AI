import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { getCases, saveHearing } from '../services/dataStorage';

export function AddHearing() {
  const navigate = useNavigate();
  const availableCases = getCases();

  // Form states
  const [selectedCaseId, setSelectedCaseId] = useState(
    availableCases[0]?.id || ''
  );
  const [hearingDate, setHearingDate] = useState(
    () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [hearingTime, setHearingTime] = useState('10:30 AM');
  const [courtRoom, setCourtRoom] = useState('Court Hall 4, Main Building');
  const [purpose, setPurpose] = useState('Final Arguments & Case Submissions');
  const [status, setStatus] = useState('Upcoming');
  const [notes, setNotes] = useState('');

  // Feedback states
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newHearingId, setNewHearingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCaseId) {
      setError('Please select an existing case for this hearing.');
      return;
    }

    if (!hearingDate) {
      setError('Hearing date is required.');
      return;
    }

    if (!purpose.trim()) {
      setError('Hearing purpose is required.');
      return;
    }

    const linkedCase = availableCases.find((c) => c.id === selectedCaseId);
    if (!linkedCase) {
      setError('Selected case record could not be found.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const createdId = `hr-${Date.now().toString().slice(-4)}`;

      const newHearingRecord = {
        id: createdId,
        caseId: linkedCase.id,
        caseTitle: linkedCase.title,
        caseNumber: linkedCase.caseNumber,
        court: linkedCase.court,
        date: hearingDate,
        time: hearingTime.trim() || '10:30 AM',
        courtRoom: courtRoom.trim() || 'Court Hall',
        purpose: purpose.trim(),
        status,
        notes: notes.trim() || 'Scheduled through hearing management.',
      };

      saveHearing(newHearingRecord);

      setIsSubmitting(false);
      setSuccess(true);
      setNewHearingId(createdId);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-[#DEDAD0] flex items-baseline justify-between">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#252A29] tracking-tight">
            Schedule New Hearing
          </h2>
          <p className="text-xs sm:text-sm text-[#747A62] mt-1 font-serif italic">
            Log an upcoming courtroom appearance or list date for an active docket matter.
          </p>
        </div>

        <Link
          to="/hearings"
          className="inline-flex items-center text-xs font-medium text-[#747A62] hover:text-[#252A29] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Hearings
        </Link>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="p-4 rounded-[8px] bg-[#747A62]/10 border border-[#747A62]/35 text-[#252A29] flex items-start space-x-3.5 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-[#747A62] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm text-[#252A29]">Hearing successfully scheduled</h4>
            <p className="text-[#747A62] mt-0.5">
              Scheduled on {hearingDate} at {hearingTime} for purpose "{purpose}".
            </p>
            <div className="mt-3 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/hearings/${newHearingId}`)}
                className="px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all"
              >
                View Hearing Details
              </button>
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setNotes('');
                }}
                className="text-xs text-[#A48658] font-medium hover:underline"
              >
                Schedule another hearing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-[6px] bg-[#713F42]/10 border border-[#713F42]/30 text-[#713F42] flex items-center space-x-2 text-xs">
          <AlertCircle className="w-4 h-4 text-[#713F42] shrink-0" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Form */}
      {availableCases.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-10 text-center space-y-3 shadow-2xs">
          <AlertCircle className="w-8 h-8 text-[#713F42] mx-auto" />
          <h3 className="text-base font-semibold text-[#252A29]">No cases registered yet</h3>
          <p className="text-xs text-[#747A62] max-w-sm mx-auto leading-relaxed">
            You must create a case record before scheduling a courtroom hearing appearance.
          </p>
          <Link
            to="/cases/new"
            className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all"
          >
            Create a Case First
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-6 space-y-5 shadow-2xs">
          {/* Linked Case Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-[#252A29] mb-1.5 uppercase tracking-wider font-mono">
              1. Select Associated Case File <span className="text-[#713F42]">*</span>
            </label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              required
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            >
              {availableCases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} — {c.title} ({c.court})
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#DEDAD0]">
            <div>
              <label className="block text-[11px] font-semibold text-[#252A29] mb-1 uppercase tracking-wider font-mono">
                Hearing Date <span className="text-[#713F42]">*</span>
              </label>
              <input
                type="date"
                value={hearingDate}
                onChange={(e) => setHearingDate(e.target.value)}
                required
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#252A29] mb-1 uppercase tracking-wider font-mono">
                Hearing Time
              </label>
              <input
                type="text"
                value={hearingTime}
                onChange={(e) => setHearingTime(e.target.value)}
                placeholder="e.g. 10:30 AM"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
              />
            </div>
          </div>

          {/* Courtroom Venue & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#252A29] mb-1 uppercase tracking-wider font-mono">
                Courtroom / Bench Room
              </label>
              <input
                type="text"
                value={courtRoom}
                onChange={(e) => setCourtRoom(e.target.value)}
                placeholder="e.g. Court Hall 4, Single Bench"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#252A29] mb-1 uppercase tracking-wider font-mono">
                Hearing Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Adjourned">Adjourned</option>
              </select>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label className="block text-[11px] font-semibold text-[#252A29] mb-1 uppercase tracking-wider font-mono">
              Purpose of Listing <span className="text-[#713F42]">*</span>
            </label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Final Arguments / Notice / Evidence Recording"
              required
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[11px] font-semibold text-[#252A29] mb-1 uppercase tracking-wider font-mono">
              Proceedings Notes / Preparation Directions
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Directions given by the court, witness to be summoned, or specific documents to carry..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#DEDAD0]">
            <button
              type="button"
              onClick={() => navigate('/hearings')}
              className="px-4 py-2 text-xs font-medium rounded-[6px] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-5 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                  Scheduling Listing...
                </>
              ) : (
                'Save Hearing Entry'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
