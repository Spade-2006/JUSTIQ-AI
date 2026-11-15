import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { saveCase } from '../services/dataStorage';

export function CreateCase() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [court, setCourt] = useState('Principal District & Sessions Court, Central');
  const [petitioner, setPetitioner] = useState('');
  const [respondent, setRespondent] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [nextHearing, setNextHearing] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [newCaseId, setNewCaseId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Case title is mandatory.');
      return;
    }

    if (!petitioner.trim()) {
      setError('Petitioner name is mandatory.');
      return;
    }

    if (!respondent.trim()) {
      setError('Respondent name is mandatory.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const createdId = `c-${Date.now().toString().slice(-4)}`;
      const currentYear = new Date().getFullYear();
      const generatedNumber = caseNumber.trim() || `CS (COMM) No. ${Math.floor(Math.random() * 900) + 100}/${currentYear}`;

      const newCaseRecord = {
        id: createdId,
        title: title.trim(),
        caseNumber: generatedNumber,
        court,
        petitioner: petitioner.trim(),
        respondent: respondent.trim(),
        description: description.trim() || `Litigation matter regarding ${title.trim()} pending before ${court}.`,
        status,
        nextHearing: nextHearing || 'None scheduled',
        nextHearingTime: nextHearing ? '10:30 AM' : '',
        courtRoom: 'Court Hall 4',
        purpose: 'Preliminary Hearing / Notice',
        hearings: nextHearing
          ? [
              {
                id: `h-init-${Date.now().toString().slice(-3)}`,
                date: nextHearing,
                time: '10:30 AM',
                courtRoom: 'Court Hall 4',
                purpose: 'Preliminary Hearing / Admission',
                status: 'Upcoming',
                notes: 'First appearance on cause list.',
              },
            ]
          : [],
        associatedJudgments: [],
      };

      saveCase(newCaseRecord);

      setIsSubmitting(false);
      setSuccess(true);
      setNewCaseId(createdId);
    }, 600);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-[#DEDAD0] flex items-baseline justify-between">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#252A29] tracking-tight">
            Register New Case Docket
          </h2>
          <p className="text-xs sm:text-sm text-[#747A62] mt-1 font-serif italic">
            Enter litigation particulars, parties, and court venue.
          </p>
        </div>

        <Link
          to="/cases"
          className="inline-flex items-center text-xs font-medium text-[#747A62] hover:text-[#252A29] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Docket
        </Link>
      </div>

      {/* Success Banner */}
      {success && (
        <div className="p-4 rounded-[8px] bg-[#747A62]/10 border border-[#747A62]/35 text-[#252A29] flex items-start space-x-3.5 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-[#747A62] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm text-[#252A29]">Case File Created & Registered</h4>
            <p className="text-[#747A62] mt-0.5">
              Docket record has been created and indexed in your chambers active management system.
            </p>
            <div className="mt-3 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/cases/${newCaseId}`)}
                className="px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all"
              >
                Open Case File
              </button>
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setTitle('');
                  setCaseNumber('');
                  setPetitioner('');
                  setRespondent('');
                  setDescription('');
                  setNextHearing('');
                }}
                className="text-xs text-[#A48658] font-medium hover:underline"
              >
                Register another case
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
      <form onSubmit={handleSubmit} className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-6 space-y-5 shadow-2xs">
        {/* Title */}
        <div>
          <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
            1. Case Cause Title <span className="text-[#713F42]">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Mehta Traders v. National Insurance Co. Ltd."
            className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-all"
          />
        </div>

        {/* Case Number & Court */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
              2. Court Docket / Filing Number
            </label>
            <input
              type="text"
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              placeholder="e.g. Arb. P. No. 420/2024"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
              3. District Court Division
            </label>
            <select
              value={court}
              onChange={(e) => setCourt(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            >
              <option value="Principal District & Sessions Court, Central">Principal District & Sessions Court, Central</option>
              <option value="District Court Tis Hazari, West">District Court Tis Hazari, West</option>
              <option value="District Court Saket, South">District Court Saket, South</option>
              <option value="District Court Patiala House, New Delhi">District Court Patiala House, New Delhi</option>
              <option value="District Court Karkardooma, East">District Court Karkardooma, East</option>
              <option value="District Court Rohini, North">District Court Rohini, North</option>
              <option value="District Commercial Court, Central">District Commercial Court, Central</option>
            </select>
          </div>
        </div>

        {/* Parties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#DEDAD0]">
          <div>
            <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
              4. Petitioner / Plaintiff <span className="text-[#713F42]">*</span>
            </label>
            <input
              type="text"
              value={petitioner}
              onChange={(e) => setPetitioner(e.target.value)}
              required
              placeholder="e.g. Mehta Traders & Logistics"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
              5. Respondent / Defendant <span className="text-[#713F42]">*</span>
            </label>
            <input
              type="text"
              value={respondent}
              onChange={(e) => setRespondent(e.target.value)}
              required
              placeholder="e.g. National Insurance Company Ltd."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>
        </div>

        {/* Status & Next Hearing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
              6. Case Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            >
              <option value="Active">Active Docket</option>
              <option value="Pending">Pending Pleadings</option>
              <option value="Closed">Disposed / Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
              7. Next Scheduled Hearing Date (Optional)
            </label>
            <input
              type="date"
              value={nextHearing}
              onChange={(e) => setNextHearing(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider font-mono mb-1">
            8. Case Brief & Chambers Instructions
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key facts, nature of claim, interim relief sought, or specific directions from the senior counsel..."
            className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
          />
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#DEDAD0]">
          <button
            type="button"
            onClick={() => navigate('/cases')}
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
                Registering Docket...
              </>
            ) : (
              'Save Case File'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
