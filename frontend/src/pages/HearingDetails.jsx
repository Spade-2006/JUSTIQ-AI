import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  FileText,
  Edit2,
  ExternalLink,
  AlertCircle,
  X,
  Share2,
  Trash2,
  Check,
} from 'lucide-react';
import {
  getHearingById,
  saveHearing,
  deleteHearing,
  getCaseById,
} from '../services/dataStorage';
import { StatusBadge } from '../components/StatusBadge';

export function HearingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load from persistent localStorage
  const [hearingRecord, setHearingRecord] = useState(() => getHearingById(id));
  const [isEditing, setIsEditing] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Edit fields
  const [editDate, setEditDate] = useState(() => hearingRecord?.date || '');
  const [editTime, setEditTime] = useState(() => hearingRecord?.time || '');
  const [editRoom, setEditRoom] = useState(() => hearingRecord?.courtRoom || '');
  const [editPurpose, setEditPurpose] = useState(() => hearingRecord?.purpose || '');
  const [editStatus, setEditStatus] = useState(() => hearingRecord?.status || 'Upcoming');
  const [editNotes, setEditNotes] = useState(() => hearingRecord?.notes || '');

  if (!hearingRecord) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[#FFFFFF] border border-[#DEDAD0] rounded-[8px] text-center space-y-3 shadow-xs">
        <AlertCircle className="w-8 h-8 mx-auto text-[#713F42]" />
        <h2 className="text-base font-semibold text-[#252A29]">Hearing Record Not Found</h2>
        <p className="text-xs text-[#747A62]">
          The requested hearing entry does not exist or has been deleted.
        </p>
        <Link
          to="/hearings"
          className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837]"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Return to Cause List
        </Link>
      </div>
    );
  }

  const linkedCase = hearingRecord.caseId ? getCaseById(hearingRecord.caseId) : null;

  const handleQuickStatusChange = (newStatus) => {
    const updated = { ...hearingRecord, status: newStatus };
    saveHearing(updated);
    setHearingRecord(updated);
    alert(`Hearing status updated to "${newStatus}".`);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();

    const updated = {
      ...hearingRecord,
      date: editDate,
      time: editTime,
      courtRoom: editRoom,
      purpose: editPurpose,
      status: editStatus,
      notes: editNotes,
    };

    saveHearing(updated);
    setHearingRecord(updated);
    setIsEditing(false);
    alert('Hearing details updated successfully.');
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete hearing listing for:\n"${hearingRecord.caseTitle}" on ${hearingRecord.date}?`)) {
      deleteHearing(hearingRecord.id);
      navigate('/hearings');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DEDAD0]">
        <Link
          to="/hearings"
          className="inline-flex items-center text-xs font-medium text-[#747A62] hover:text-[#252A29] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Hearings
        </Link>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopyFeedback(true);
              setTimeout(() => setCopyFeedback(false), 2000);
            }}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[6px] bg-[#FFFFFF] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC] transition-colors"
          >
            {copyFeedback ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-[#747A62]" /> Link Copied
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 mr-1.5 text-[#747A62]" /> Share
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-2xs"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1.5 text-[#A48658]" />
            {isEditing ? 'Cancel Edit' : 'Edit Hearing'}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[6px] border border-[#713F42]/30 text-[#713F42] bg-[#713F42]/10 hover:bg-[#713F42]/20"
            title="Delete this hearing record"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
          </button>
        </div>
      </div>

      {/* Main Hearing Card */}
      <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-6 space-y-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-[#F4F2EC] text-[#A48658] border border-[#DEDAD0]">
                {hearingRecord.caseNumber}
              </span>
              <StatusBadge status={hearingRecord.status} />
              <span className="text-xs text-[#747A62]">{hearingRecord.court}</span>
            </div>

            <h1 className="font-editorial text-xl sm:text-2xl font-bold text-[#252A29] tracking-tight pt-1">
              {hearingRecord.purpose}
            </h1>
            <p className="text-xs font-medium text-[#747A62] font-serif italic">
              In Matter of: <strong className="text-[#252A29] not-italic">{hearingRecord.caseTitle}</strong>
            </p>
          </div>

          {/* Quick status buttons */}
          <div className="flex sm:flex-col items-center sm:items-end gap-1.5">
            <span className="text-[10px] text-[#747A62] uppercase tracking-wider font-mono font-semibold">
              Update Status:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickStatusChange('Upcoming')}
                className={`px-2.5 py-1 text-xs rounded-[4px] border transition-all ${
                  hearingRecord.status === 'Upcoming'
                    ? 'bg-[#252A29] text-[#FFFFFF] border-[#252A29] font-medium shadow-2xs'
                    : 'bg-[#F4F2EC] text-[#252A29] border-[#DEDAD0] hover:bg-[#FFFFFF]'
                }`}
              >
                Upcoming
              </button>
              <button
                type="button"
                onClick={() => handleQuickStatusChange('Completed')}
                className={`px-2.5 py-1 text-xs rounded-[4px] border transition-all ${
                  hearingRecord.status === 'Completed'
                    ? 'bg-[#747A62] text-[#FFFFFF] border-[#747A62] font-medium shadow-2xs'
                    : 'bg-[#F4F2EC] text-[#252A29] border-[#DEDAD0] hover:bg-[#FFFFFF]'
                }`}
              >
                Completed
              </button>
              <button
                type="button"
                onClick={() => handleQuickStatusChange('Adjourned')}
                className={`px-2.5 py-1 text-xs rounded-[4px] border transition-all ${
                  hearingRecord.status === 'Adjourned'
                    ? 'bg-[#713F42] text-[#FFFFFF] border-[#713F42] font-medium shadow-2xs'
                    : 'bg-[#F4F2EC] text-[#252A29] border-[#DEDAD0] hover:bg-[#FFFFFF]'
                }`}
              >
                Adjourned
              </button>
            </div>
          </div>
        </div>

        {/* Date / Time / Room Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-[#DEDAD0] text-xs">
          <div className="p-3.5 bg-[#F4F2EC]/60 rounded-[6px] border border-[#DEDAD0] space-y-1">
            <span className="text-[#747A62] text-[10px] uppercase tracking-wider font-semibold font-mono flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#713F42]" /> Hearing Date
            </span>
            <p className="font-semibold text-sm text-[#713F42] font-mono">{hearingRecord.date}</p>
          </div>

          <div className="p-3.5 bg-[#F4F2EC]/60 rounded-[6px] border border-[#DEDAD0] space-y-1">
            <span className="text-[#747A62] text-[10px] uppercase tracking-wider font-semibold font-mono flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-[#747A62]" /> Cause List Time
            </span>
            <p className="font-semibold text-sm text-[#252A29]">{hearingRecord.time}</p>
          </div>

          <div className="p-3.5 bg-[#F4F2EC]/60 rounded-[6px] border border-[#DEDAD0] space-y-1">
            <span className="text-[#747A62] text-[10px] uppercase tracking-wider font-semibold font-mono flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-[#747A62]" /> Courtroom Venue
            </span>
            <p className="font-semibold text-sm text-[#252A29]">{hearingRecord.courtRoom}</p>
          </div>
        </div>

        {/* Proceedings Notes */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-[#252A29] uppercase tracking-wider font-mono block mb-1">
            Court Proceedings Notes
          </span>
          <div className="p-4 bg-[#F4F2EC]/50 rounded-[6px] border border-[#DEDAD0] text-xs text-[#252A29] leading-relaxed">
            {hearingRecord.notes || 'No specific courtroom instructions recorded.'}
          </div>
        </div>
      </div>

      {/* Edit Form Drawer */}
      {isEditing && (
        <form
          onSubmit={handleSaveEdit}
          className="bg-[#FFFFFF] rounded-[8px] border border-[#252A29] p-6 space-y-4 shadow-md"
        >
          <div className="flex items-center justify-between pb-2.5 border-b border-[#DEDAD0]">
            <h3 className="text-sm font-bold text-[#252A29]">Edit Hearing Listing</h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-[#747A62] hover:text-[#252A29]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block text-[#252A29] font-medium mb-1">Date</label>
              <input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#252A29]"
              />
            </div>
            <div>
              <label className="block text-[#252A29] font-medium mb-1">Time</label>
              <input
                type="text"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#252A29]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div>
              <label className="block text-[#252A29] font-medium mb-1">Court Room</label>
              <input
                type="text"
                value={editRoom}
                onChange={(e) => setEditRoom(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#252A29]"
              />
            </div>
            <div>
              <label className="block text-[#252A29] font-medium mb-1">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#252A29]"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Adjourned">Adjourned</option>
              </select>
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-[#252A29] font-medium mb-1">Purpose</label>
            <input
              type="text"
              value={editPurpose}
              onChange={(e) => setEditPurpose(e.target.value)}
              required
              className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#252A29]"
            />
          </div>

          <div className="text-xs">
            <label className="block text-[#252A29] font-medium mb-1">Proceedings Notes</label>
            <textarea
              rows={3}
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#252A29]"
            />
          </div>

          <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-[#DEDAD0]">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3.5 py-1.5 rounded-[6px] border border-[#DEDAD0] text-[#252A29] text-xs hover:bg-[#F4F2EC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-[6px] bg-[#252A29] text-[#FFFFFF] text-xs hover:bg-[#323837] font-medium shadow-2xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Associated Case File Section */}
      <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-6 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#DEDAD0]">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-[#A48658]" />
            <h3 className="font-editorial text-sm font-bold text-[#252A29] uppercase tracking-wide">
              Linked Case Matter
            </h3>
          </div>

          {linkedCase && (
            <Link
              to={`/cases/${linkedCase.id}`}
              className="inline-flex items-center text-xs font-semibold text-[#A48658] hover:text-[#252A29] transition-colors"
            >
              Open Full Case File <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </Link>
          )}
        </div>

        {linkedCase ? (
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#252A29] font-editorial">{linkedCase.title}</h4>
                <p className="font-mono text-xs text-[#A48658] mt-0.5">{linkedCase.caseNumber}</p>
              </div>
              <StatusBadge status={linkedCase.status} />
            </div>

            <p className="text-xs text-[#747A62] leading-relaxed">
              {linkedCase.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 bg-[#F4F2EC]/60 rounded-[6px] border border-[#DEDAD0]">
                <span className="text-[#747A62] text-[10px] uppercase font-mono block">Petitioner:</span>
                <span className="font-semibold text-[#252A29] text-xs">{linkedCase.petitioner}</span>
              </div>
              <div className="p-3 bg-[#F4F2EC]/60 rounded-[6px] border border-[#DEDAD0]">
                <span className="text-[#747A62] text-[10px] uppercase font-mono block">Respondent:</span>
                <span className="font-semibold text-[#252A29] text-xs">{linkedCase.respondent}</span>
              </div>
            </div>

            {/* Linked judgments count */}
            {linkedCase.associatedJudgments?.length > 0 && (
              <div className="pt-2 text-xs text-[#747A62] flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-[#A48658]" />
                <span>
                  {linkedCase.associatedJudgments.length} precedent judgments cited in this matter.
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-[#747A62]">Associated case record not found.</p>
        )}
      </div>
    </div>
  );
}
