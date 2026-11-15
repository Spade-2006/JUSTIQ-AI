import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Plus,
  ExternalLink,
  AlertCircle,
  Bookmark,
  Share2,
  Trash2,
  X,
  Scale,
  Edit2,
  Check,
} from 'lucide-react';
import {
  getCaseById,
  saveCase,
  deleteCase,
  getJudgments,
} from '../services/dataStorage';
import { StatusBadge } from '../components/StatusBadge';

export function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Load persistent case record
  const [caseRecord, setCaseRecord] = useState(() => getCaseById(id));
  const availableJudgments = getJudgments();

  // Modal / Interaction states for adding judgment & hearing
  const [showAddHearingModal, setShowAddHearingModal] = useState(false);
  const [showAddJudgmentModal, setShowAddJudgmentModal] = useState(false);

  // New hearing form fields
  const [newHearingDate, setNewHearingDate] = useState(() => {
    const twoWeeksLater = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    return twoWeeksLater.toISOString().split('T')[0];
  });
  const [newHearingTime, setNewHearingTime] = useState('11:00 AM');
  const [newHearingRoom, setNewHearingRoom] = useState('Court Hall 4');
  const [newHearingPurpose, setNewHearingPurpose] = useState('Oral Arguments');
  const [newHearingNotes, setNewHearingNotes] = useState('');

  // Selected judgment to associate
  const [selectedJudgmentId, setSelectedJudgmentId] = useState('');

  // Case saved bookmark state
  const [isSaved, setIsSaved] = useState(() => Boolean(caseRecord?.isSaved));
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Edit Case Details Modal state
  const [showEditCaseModal, setShowEditCaseModal] = useState(false);
  const [editTitle, setEditTitle] = useState(() => caseRecord?.title || '');
  const [editCourt, setEditCourt] = useState(() => caseRecord?.court || '');
  const [editPetitioner, setEditPetitioner] = useState(() => caseRecord?.petitioner || '');
  const [editRespondent, setEditRespondent] = useState(() => caseRecord?.respondent || '');
  const [editStatus, setEditStatus] = useState(() => caseRecord?.status || 'Active');
  const [editDescription, setEditDescription] = useState(() => caseRecord?.description || '');

  if (!caseRecord) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[#FFFFFF] border border-[#DEDAD0] rounded-[8px] text-center space-y-3 shadow-xs">
        <AlertCircle className="w-8 h-8 mx-auto text-[#713F42]" />
        <h2 className="text-base font-semibold text-[#252A29]">Case Record Not Found</h2>
        <p className="text-xs text-[#747A62]">
          The requested case file does not exist or has been deleted from your workspace.
        </p>
        <Link
          to="/cases"
          className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837]"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Return to Docket
        </Link>
      </div>
    );
  }

  const handleToggleBookmark = () => {
    const updated = {
      ...caseRecord,
      isSaved: !isSaved,
    };
    saveCase(updated);
    setCaseRecord(updated);
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleUpdateCase = (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editPetitioner.trim() || !editRespondent.trim()) return;

    const updated = {
      ...caseRecord,
      title: editTitle.trim(),
      court: editCourt,
      petitioner: editPetitioner.trim(),
      respondent: editRespondent.trim(),
      status: editStatus,
      description: editDescription.trim(),
    };

    saveCase(updated);
    setCaseRecord(updated);
    setShowEditCaseModal(false);
  };

  const handleSaveHearing = (e) => {
    e.preventDefault();
    if (!newHearingDate) return;

    const newHearingEntry = {
      id: `h-${Date.now().toString().slice(-4)}`,
      date: newHearingDate,
      time: newHearingTime,
      courtRoom: newHearingRoom,
      purpose: newHearingPurpose,
      status: 'Upcoming',
      notes: newHearingNotes.trim() || 'Next scheduled appearance.',
    };

    const updatedCase = {
      ...caseRecord,
      nextHearing: newHearingDate,
      nextHearingTime: newHearingTime,
      courtRoom: newHearingRoom,
      purpose: newHearingPurpose,
      hearings: [newHearingEntry, ...(caseRecord.hearings || [])],
    };

    saveCase(updatedCase);
    setCaseRecord(updatedCase);

    setShowAddHearingModal(false);
    alert('New hearing scheduled and recorded in case history.');
  };

  const handleLinkJudgment = (e) => {
    e.preventDefault();
    if (!selectedJudgmentId) return;

    const foundJud = availableJudgments.find((j) => j.id === selectedJudgmentId);
    if (!foundJud) return;

    const alreadyLinked = (caseRecord.associatedJudgments || []).some(
      (j) => j.id === selectedJudgmentId
    );

    if (alreadyLinked) {
      alert('This judgment is already associated with this case file.');
      return;
    }

    const newJudgmentRef = {
      id: foundJud.id,
      title: foundJud.title,
      court: foundJud.court,
      citation: foundJud.citation,
    };

    const updatedCase = {
      ...caseRecord,
      associatedJudgments: [...(caseRecord.associatedJudgments || []), newJudgmentRef],
    };

    saveCase(updatedCase);
    setCaseRecord(updatedCase);

    setShowAddJudgmentModal(false);
    setSelectedJudgmentId('');
    alert(`Linked "${foundJud.citation}" to this case.`);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete case file:\n"${caseRecord.title}"?`)) {
      deleteCase(caseRecord.id);
      navigate('/cases');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Action Controls */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DEDAD0]">
        <Link
          to="/cases"
          className="inline-flex items-center text-xs font-medium text-[#747A62] hover:text-[#252A29] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Docket
        </Link>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleToggleBookmark}
            className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[6px] border transition-colors ${
              isSaved
                ? 'bg-[#A48658]/15 text-[#685333] border-[#A48658]/50 font-semibold'
                : 'bg-[#FFFFFF] text-[#252A29] border-[#DEDAD0] hover:bg-[#F4F2EC]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 mr-1.5 ${isSaved ? 'fill-current text-[#A48658]' : ''}`} />
            {isSaved ? 'Bookmarked' : 'Save'}
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[6px] bg-[#FFFFFF] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC]"
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
            onClick={() => {
              setEditTitle(caseRecord.title);
              setEditCourt(caseRecord.court);
              setEditPetitioner(caseRecord.petitioner);
              setEditRespondent(caseRecord.respondent);
              setEditStatus(caseRecord.status);
              setEditDescription(caseRecord.description || '');
              setShowEditCaseModal(true);
            }}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[6px] bg-[#FFFFFF] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC]"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1.5 text-[#747A62]" /> Edit Docket
          </button>

          <button
            type="button"
            onClick={() => setShowAddHearingModal(true)}
            className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5 text-[#A48658]" /> Schedule Hearing
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[6px] border border-[#713F42]/30 text-[#713F42] bg-[#713F42]/10 hover:bg-[#713F42]/20"
            title="Delete this case record"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5 text-[#713F42]" /> Delete
          </button>
        </div>
      </div>

      {/* Case Header & Overview Card */}
      <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-6 space-y-4 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-[#F4F2EC] text-[#A48658] border border-[#DEDAD0]">
                {caseRecord.caseNumber}
              </span>
              <StatusBadge status={caseRecord.status} />
              <span className="text-xs text-[#747A62] font-medium flex items-center">
                <Scale className="w-3 h-3 mr-1" />
                {caseRecord.court}
              </span>
            </div>

            <h1 className="font-editorial text-xl sm:text-2xl font-bold text-[#252A29] tracking-tight pt-1">
              {caseRecord.title}
            </h1>

            <p className="text-xs sm:text-sm text-[#252A29]/80 pt-1 leading-relaxed">
              {caseRecord.description}
            </p>
          </div>
        </div>

        {/* Parties Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t border-[#DEDAD0] text-xs">
          <div className="p-3.5 bg-[#F4F2EC]/60 rounded-[6px] border border-[#DEDAD0]">
            <span className="text-[#747A62] block text-[10px] uppercase tracking-wider font-semibold font-mono">
              Petitioner / Plaintiff (Represented)
            </span>
            <span className="font-bold text-sm text-[#252A29] block mt-0.5 font-editorial">
              {caseRecord.petitioner}
            </span>
            <span className="text-[10px] text-[#747A62] block mt-0.5">Appearing Counsel: Chambers Representation</span>
          </div>

          <div className="p-3.5 bg-[#F4F2EC]/60 rounded-[6px] border border-[#DEDAD0]">
            <span className="text-[#747A62] block text-[10px] uppercase tracking-wider font-semibold font-mono">
              Respondent / Defendant (Opposite)
            </span>
            <span className="font-bold text-sm text-[#252A29] block mt-0.5 font-editorial">
              {caseRecord.respondent}
            </span>
            <span className="text-[10px] text-[#747A62] block mt-0.5">Opposite Party</span>
          </div>
        </div>
      </div>

      {/* Main Content: Left (Upcoming Hearing & Hearing Timeline) | Right (Associated Judgments) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Hearing Schedule & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Hearing Banner Card */}
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#DEDAD0]">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#713F42]" />
                <h3 className="font-editorial text-sm font-bold text-[#252A29] uppercase tracking-wide">
                  Upcoming Hearing Listing
                </h3>
              </div>
              <StatusBadge status={caseRecord.status === 'Closed' ? 'Completed' : 'Upcoming'} />
            </div>

            {caseRecord.status === 'Closed' || !caseRecord.nextHearing || caseRecord.nextHearing === 'None' ? (
              <p className="text-xs text-[#747A62]">
                No pending appearance date scheduled. Click "Schedule Hearing" above to log a new listing date.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[#747A62] text-[10px] block font-mono uppercase tracking-wider">Date & Time:</span>
                  <div className="flex items-center font-semibold text-[#713F42]">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    <span>{caseRecord.nextHearing} ({caseRecord.nextHearingTime || '10:30 AM'})</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[#747A62] text-[10px] block font-mono uppercase tracking-wider">Courtroom Venue:</span>
                  <div className="flex items-center font-medium text-[#252A29]">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-[#747A62]" />
                    <span>{caseRecord.courtRoom || 'Main Bench'}</span>
                  </div>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[#747A62] text-[10px] block font-mono uppercase tracking-wider">Purpose:</span>
                  <span className="font-semibold text-[#A48658] block">
                    {caseRecord.purpose || 'Oral Arguments'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Hearing History Timeline */}
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#DEDAD0]">
              <h3 className="font-editorial text-sm font-bold text-[#252A29] uppercase tracking-wide">
                Proceedings & Hearing History ({caseRecord.hearings?.length || 0})
              </h3>
              <button
                type="button"
                onClick={() => setShowAddHearingModal(true)}
                className="inline-flex items-center text-xs font-semibold text-[#A48658] hover:text-[#252A29]"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Entry
              </button>
            </div>

            {caseRecord.hearings && caseRecord.hearings.length > 0 ? (
              <div className="space-y-3">
                {caseRecord.hearings.map((h, idx) => (
                  <div
                    key={h.id || idx}
                    className="p-3.5 rounded-[6px] border border-[#DEDAD0] bg-[#F4F2EC]/40 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xs text-[#252A29]">
                          {h.date}
                        </span>
                        <span className="text-[11px] text-[#747A62]">at {h.time}</span>
                        <span className="text-[11px] text-[#747A62]">({h.courtRoom})</span>
                      </div>
                      <StatusBadge status={h.status} />
                    </div>

                    <p className="text-xs font-medium text-[#A48658]">{h.purpose}</p>

                    {h.notes && (
                      <p className="text-xs text-[#252A29]/80 pt-1 border-t border-[#DEDAD0]/70">
                        {h.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#747A62]">No hearing history recorded for this matter yet.</p>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Associated Precedents & Judgments */}
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#DEDAD0]">
              <div className="flex items-center space-x-1.5">
                <FileText className="w-4 h-4 text-[#A48658]" />
                <h3 className="font-editorial text-sm font-bold text-[#252A29] uppercase tracking-wide">
                  Cited Judgments ({caseRecord.associatedJudgments?.length || 0})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddJudgmentModal(true)}
                className="inline-flex items-center text-xs font-semibold text-[#A48658] hover:text-[#252A29]"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Link
              </button>
            </div>

            {caseRecord.associatedJudgments && caseRecord.associatedJudgments.length > 0 ? (
              <div className="space-y-2.5">
                {caseRecord.associatedJudgments.map((jud) => (
                  <div
                    key={jud.id}
                    onClick={() => navigate(`/judgments/${jud.id}`)}
                    className="p-3 rounded-[6px] border border-[#DEDAD0] hover:border-[#A48658] bg-[#F4F2EC]/40 hover:bg-[#FFFFFF] transition-all cursor-pointer space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-[#252A29] line-clamp-1">
                        {jud.title}
                      </p>
                      <ExternalLink className="w-3 h-3 text-[#747A62] shrink-0 ml-1" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#747A62]">
                      <span>{jud.court}</span>
                      <span className="font-mono text-[#A48658] font-medium">{jud.citation}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 text-center rounded-[6px] border border-dashed border-[#DEDAD0] text-xs text-[#747A62] space-y-2">
                <p>No judgments linked to this case file yet.</p>
                <button
                  type="button"
                  onClick={() => setShowAddJudgmentModal(true)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[4px] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC]"
                >
                  <Plus className="w-3 h-3 mr-1 text-[#A48658]" /> Link Precedent Judgment
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Edit Case Details */}
      {showEditCaseModal && (
        <div className="fixed inset-0 z-50 bg-[#252A29]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#DEDAD0] pb-2.5">
              <h3 className="text-sm font-bold text-[#252A29]">Edit Case Docket</h3>
              <button
                type="button"
                onClick={() => setShowEditCaseModal(false)}
                className="text-[#747A62] hover:text-[#252A29]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCase} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#252A29] font-medium mb-1">Case Title *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#252A29] font-medium mb-1">District Court Division</label>
                  <select
                    value={editCourt}
                    onChange={(e) => setEditCourt(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
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

                <div>
                  <label className="block text-[#252A29] font-medium mb-1">Matter Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Adjourned">Adjourned</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#252A29] font-medium mb-1">Petitioner *</label>
                  <input
                    type="text"
                    value={editPetitioner}
                    onChange={(e) => setEditPetitioner(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
                  />
                </div>

                <div>
                  <label className="block text-[#252A29] font-medium mb-1">Respondent *</label>
                  <input
                    type="text"
                    value={editRespondent}
                    onChange={(e) => setEditRespondent(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#252A29] font-medium mb-1">Summary / Matter Notes</label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-[#DEDAD0]">
                <button
                  type="button"
                  onClick={() => setShowEditCaseModal(false)}
                  className="px-3.5 py-1.5 rounded-[6px] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] font-medium shadow-2xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Hearing */}
      {showAddHearingModal && (
        <div className="fixed inset-0 z-50 bg-[#252A29]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#DEDAD0] pb-2.5">
              <h3 className="text-sm font-bold text-[#252A29]">Schedule / Record Hearing</h3>
              <button
                type="button"
                onClick={() => setShowAddHearingModal(false)}
                className="text-[#747A62] hover:text-[#252A29]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveHearing} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#252A29] font-medium mb-1">Hearing Date</label>
                <input
                  type="date"
                  value={newHearingDate}
                  onChange={(e) => setNewHearingDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#252A29]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#252A29] font-medium mb-1">Time</label>
                  <input
                    type="text"
                    value={newHearingTime}
                    onChange={(e) => setNewHearingTime(e.target.value)}
                    placeholder="10:30 AM"
                    className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#252A29]"
                  />
                </div>
                <div>
                  <label className="block text-[#252A29] font-medium mb-1">Court Room</label>
                  <input
                    type="text"
                    value={newHearingRoom}
                    onChange={(e) => setNewHearingRoom(e.target.value)}
                    placeholder="Hall 4"
                    className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#252A29]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#252A29] font-medium mb-1">Purpose / Listing Item</label>
                <input
                  type="text"
                  value={newHearingPurpose}
                  onChange={(e) => setNewHearingPurpose(e.target.value)}
                  placeholder="e.g. Evidence / Arguments / Admission"
                  required
                  className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#252A29]"
                />
              </div>

              <div>
                <label className="block text-[#252A29] font-medium mb-1">Proceedings Notes</label>
                <textarea
                  rows={2}
                  value={newHearingNotes}
                  onChange={(e) => setNewHearingNotes(e.target.value)}
                  placeholder="Notes from court or preparation directions..."
                  className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#252A29]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-[#DEDAD0]">
                <button
                  type="button"
                  onClick={() => setShowAddHearingModal(false)}
                  className="px-3.5 py-1.5 rounded-[6px] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] font-medium shadow-2xs"
                >
                  Save Hearing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Judgment */}
      {showAddJudgmentModal && (
        <div className="fixed inset-0 z-50 bg-[#252A29]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#DEDAD0] pb-2.5">
              <h3 className="text-sm font-bold text-[#252A29]">Link Precedent Judgment</h3>
              <button
                type="button"
                onClick={() => setShowAddJudgmentModal(false)}
                className="text-[#747A62] hover:text-[#252A29]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLinkJudgment} className="space-y-3.5 text-xs">
              {availableJudgments.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#747A62]">
                  No judgments available in your library yet.{' '}
                  <Link to="/judgments/upload" className="text-[#A48658] font-semibold underline">
                    Upload a judgment first
                  </Link>.
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[#252A29] font-medium mb-1">
                      Select Judgment from Library
                    </label>
                    <select
                      value={selectedJudgmentId}
                      onChange={(e) => setSelectedJudgmentId(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#252A29]"
                    >
                      <option value="">-- Choose Judgment --</option>
                      {availableJudgments.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.citation} · {j.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-[11px] text-[#747A62] leading-relaxed">
                    Linking associates the judgment summary and ratio decidendi to this case file for courtroom preparation.
                  </p>

                  <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-[#DEDAD0]">
                    <button
                      type="button"
                      onClick={() => setShowAddJudgmentModal(false)}
                      className="px-3.5 py-1.5 rounded-[6px] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!selectedJudgmentId}
                      className="px-4 py-1.5 rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] font-medium disabled:opacity-50 shadow-2xs"
                    >
                      Link Judgment
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
