import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Bookmark,
  Share2,
  Download,
  AlertCircle,
  ExternalLink,
  Scale,
  BookOpen,
  Trash2,
  ShieldCheck,
  Copy,
  Check,
  RotateCcw,
  Info,
  HelpCircle,
  Gavel,
  BookMarked,
  ScrollText,
  Edit2,
  Eye,
  X,
} from 'lucide-react';
import { getJudgmentById, saveJudgment, deleteJudgment } from '../services/dataStorage';
import { getPDFFile } from '../services/pdfStorage';
import { StatusBadge } from '../components/StatusBadge';

export function JudgmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [judgment, setJudgment] = useState(() => getJudgmentById(id));
  const [activeTab, setActiveTab] = useState('summary');
  const [isSaved, setIsSaved] = useState(() => Boolean(judgment?.isSaved));
  const [copiedSection, setCopiedSection] = useState(null);
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // PDF Preview and Download states from IndexedDB
  const [pdfRecord, setPdfRecord] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Edit Metadata Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(() => judgment?.title || '');
  const [editCitation, setEditCitation] = useState(() => judgment?.citation || '');
  const [editCourt, setEditCourt] = useState(() => judgment?.court || '');
  const [editBench, setEditBench] = useState(() => judgment?.bench || '');
  const [editStatus, setEditStatus] = useState(() => judgment?.status || 'Completed');

  // Load physical PDF from IndexedDB
  useEffect(() => {
    let activeUrl = null;
    if (id) {
      getPDFFile(id).then((record) => {
        if (record && record.blob) {
          setPdfRecord(record);
          activeUrl = URL.createObjectURL(record.blob);
          setPdfBlobUrl(activeUrl);
        }
      });
    }

    return () => {
      if (activeUrl) {
        URL.revokeObjectURL(activeUrl);
      }
    };
  }, [id]);

  if (!judgment) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[#FFFFFF] border border-[#DEDAD0] rounded-[8px] text-center space-y-3 shadow-xs">
        <AlertCircle className="w-8 h-8 mx-auto text-[#713F42]" />
        <h2 className="text-base font-semibold text-[#252A29]">Record Not Found</h2>
        <p className="text-xs text-[#747A62]">
          This judgment does not exist in your workspace or has been removed.
        </p>
        <Link
          to="/judgments"
          className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837]"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Return to Archive
        </Link>
      </div>
    );
  }

  // Fallbacks for structured fields
  const facts = judgment.facts || [
    `The plaintiff instituted civil recovery proceedings before the District Court based on unpaid commercial invoices and acknowledged ledger statements.`,
    `The defendant entered appearance, resisted the suit on grounds of delayed delivery, and disputed calculation of interest in their written statement.`,
    `Following conclusion of plaintiff and defendant evidence, the matter was heard for final arguments on liability and entitlement to decree.`,
  ];

  const legalIssues = judgment.legalIssues || [
    `Whether the suit is filed within prescribed limitation under the Limitation Act, 1963.`,
    `Whether the plaintiff has proved delivery and consideration under the contested invoices in accordance with the Indian Evidence Act.`,
    `Whether the plaintiff is entitled to pendente lite and future commercial interest as claimed in the plaint.`,
  ];

  const argumentsData = judgment.arguments || {
    petitioner: [
      `Goods and consignments were delivered against acknowledged challans with contemporaneous proof of receipt.`,
      `The defendant accepted partial billing without protest and raised disputes solely after receipt of legal demand notice.`,
      `Audited books of account maintained in ordinary course of business corroborated by bank certificates establish liability.`,
    ],
    respondent: [
      `The District Court lacked territorial jurisdiction since invoices were delivered outside district limits.`,
      `Defects in consignments were communicated verbally to the plaintiff's sales representative.`,
      `Claimed interest at commercial rate is penal and without express contractual consensus between the parties.`,
    ],
  };

  const courtsReasoning = judgment.courtsReasoning || [
    `The Court examined delivery receipts and electronic billing records complying with evidentiary certifications.`,
    `Bare denials in written statements without leading positive rebuttal evidence cannot dislodge documented commercial ledger entries.`,
    `The defendant failed to prove any formal rejection or return of consignments within a reasonable timeline.`,
  ];

  const ratioDecidendi = judgment.ratioDecidendi || (judgment.keyPoints?.[0] || 'In civil commercial recovery suits before the District Court, duly verified delivery acknowledgements and ledger entries shift the evidentiary burden onto the defendant to prove discharge or defect.');

  const finalJudgment = judgment.finalJudgment || 'Suit of the plaintiff is decreed with costs. The defendant is directed to satisfy the principal claim along with 9% per annum interest from date of institution until realization.';

  const keyPrinciples = judgment.keyPoints || [
    'Evidentiary Burden of Proof in District Civil Suits',
    'Admissibility of Verified Commercial Ledger Statements',
    'Specific Denial Requirements under Order VIII Rule 5 CPC',
  ];

  const citationsList = judgment.citations || [
    judgment.citation,
    'Civil Suit No. 412/2021 (Tis Hazari District Court)',
    'Commercial Suit No. 19/2022 (Patiala House District Court)',
  ];

  const statutesList = judgment.relevantStatutes || [
    'Code of Civil Procedure, 1908 — Order VII & Order VIII',
    'Indian Contract Act, 1872 — Section 73',
    'Commercial Courts Act, 2015 — Section 2(1)(c)',
  ];

  const handleDownloadOriginalPdf = () => {
    if (pdfBlobUrl && pdfRecord) {
      const link = document.createElement('a');
      link.href = pdfBlobUrl;
      link.download = pdfRecord.fileName || judgment.fileName || 'judgment.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('Original PDF file is not stored in this browser session. You can re-upload the document in the Upload Judgment section.');
    }
  };

  const handleSaveMetadata = (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    const updated = {
      ...judgment,
      title: editTitle.trim(),
      citation: editCitation.trim() || judgment.citation,
      court: editCourt,
      bench: editBench.trim() || judgment.bench,
      status: editStatus,
    };

    saveJudgment(updated);
    setJudgment(updated);
    setShowEditModal(false);
  };
  const handleCopyText = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  // Downloadable legal brief generator (.txt formatted legal brief)
  const handleDownloadLegalBrief = () => {
    const briefContent = `================================================================================
JUSTIQ LEGAL BRIEF: ${judgment.title.toUpperCase()}
================================================================================
CITATION: ${judgment.citation}
COURT: ${judgment.court}
DATE OF PRONOUNCEMENT: ${judgment.judgmentDate}
BENCH: ${judgment.bench || 'Presiding District Judge'}
PETITIONER: ${judgment.parties?.petitioner || 'Petitioner'}
RESPONDENT: ${judgment.parties?.respondent || 'Respondent'}
STATUS: ${judgment.status}
--------------------------------------------------------------------------------
1. EXECUTIVE SUMMARY:
${judgment.summary || 'Summary unavailable.'}

--------------------------------------------------------------------------------
2. FACTS OF THE CASE:
${facts.map((f, i) => `[${i + 1}] ${f}`).join('\n')}

--------------------------------------------------------------------------------
3. LEGAL ISSUES FRAMED:
${legalIssues.map((issue, i) => `[Issue ${i + 1}] ${issue}`).join('\n')}

--------------------------------------------------------------------------------
4. ARGUMENTS OF THE PARTIES:
PETITIONER / APPELLANT:
${argumentsData.petitioner.map((arg) => `  * ${arg}`).join('\n')}

RESPONDENT / OPPONENT:
${argumentsData.respondent.map((arg) => `  * ${arg}`).join('\n')}

--------------------------------------------------------------------------------
5. COURT'S REASONING:
${courtsReasoning.map((r, i) => `[${i + 1}] ${r}`).join('\n')}

--------------------------------------------------------------------------------
6. RATIO DECIDENDI:
${ratioDecidendi}

--------------------------------------------------------------------------------
7. FINAL JUDGMENT / OPERATIVE ORDER:
${finalJudgment}

--------------------------------------------------------------------------------
8. IMPORTANT LEGAL PRINCIPLES:
${keyPrinciples.map((p) => `  * ${p}`).join('\n')}

--------------------------------------------------------------------------------
9. CITED PRECEDENTS:
${citationsList.map((c, i) => `  [${i + 1}] ${c}`).join('\n')}

--------------------------------------------------------------------------------
10. RELEVANT STATUTES:
${statutesList.map((s) => `  * ${s}`).join('\n')}
================================================================================
Generated via JUSTIQ AI Chambers Ingestion Pipeline.
[DEMO MODE: Generated for research demonstration purposes]
================================================================================`;

    const blob = new Blob([briefContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Legal_Brief_${judgment.citation.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reprocess / Retry simulation
  const handleReprocess = () => {
    setIsReprocessing(true);
    setTimeout(() => {
      const updated = {
        ...judgment,
        status: 'Completed',
        judgmentDate: new Date().toISOString().split('T')[0],
      };
      saveJudgment(updated);
      setJudgment(updated);
      setIsReprocessing(false);
      alert('AI Legal Synthesis refreshed successfully.');
    }, 1200);
  };

  const handleToggleBookmark = () => {
    const updated = {
      ...judgment,
      isSaved: !isSaved,
    };
    saveJudgment(updated);
    setJudgment(updated);
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleDelete = () => {
    if (confirm(`Permanently remove judgment record:\n"${judgment.title}"?`)) {
      deleteJudgment(judgment.id);
      navigate('/judgments');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#DEDAD0]">
        <Link
          to="/judgments"
          className="inline-flex items-center text-xs font-medium text-[#747A62] hover:text-[#252A29] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Archive
        </Link>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {pdfBlobUrl && (
            <button
              type="button"
              onClick={() => setShowPdfModal(true)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[6px] bg-[#A48658]/10 text-[#685333] border border-[#A48658]/40 hover:bg-[#A48658]/20 transition-colors"
              title="Preview actual uploaded PDF"
            >
              <Eye className="w-3.5 h-3.5 mr-1.5 text-[#A48658]" /> Preview PDF
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setEditTitle(judgment.title);
              setEditCitation(judgment.citation);
              setEditCourt(judgment.court);
              setEditBench(judgment.bench || '');
              setEditStatus(judgment.status);
              setShowEditModal(true);
            }}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[6px] bg-[#FFFFFF] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC] transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 mr-1.5 text-[#747A62]" /> Edit Record
          </button>

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
            onClick={handleDownloadLegalBrief}
            className="inline-flex items-center px-3.5 py-1.5 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-2xs transition-all"
          >
            <Download className="w-3.5 h-3.5 mr-1.5 text-[#A48658]" /> Download Legal Brief
          </button>

          <button
            type="button"
            onClick={handleReprocess}
            disabled={isReprocessing}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[6px] border border-[#DEDAD0] bg-[#FFFFFF] text-[#252A29] hover:bg-[#F4F2EC]"
            title="Refresh AI Extraction"
          >
            <RotateCcw className={`w-3.5 h-3.5 mr-1 text-[#747A62] ${isReprocessing ? 'animate-spin' : ''}`} />
            {isReprocessing ? 'Refreshing...' : 'Re-analyze'}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-[6px] border border-[#713F42]/30 text-[#713F42] bg-[#713F42]/10 hover:bg-[#713F42]/20"
            title="Delete this record"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
          </button>
        </div>
      </div>

      {/* Demo Mode Banner */}
      <div className="p-3 bg-[#A48658]/10 rounded-[6px] border border-[#A48658]/35 flex items-start space-x-2.5 text-xs text-[#685333]">
        <Info className="w-4 h-4 text-[#A48658] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-[#252A29]">
            DEMO MODE · Automated Legal Synthesis
          </p>
          <p className="text-[11px] text-[#747A62] leading-relaxed">
            The brief below is rendered using structured mock extraction. Cross-check against the official certified transcript before filing in court.
          </p>
        </div>
      </div>

      {/* Metadata Overview Card */}
      <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-6 space-y-4 shadow-2xs">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-[4px] bg-[#F4F2EC] text-[#A48658] border border-[#DEDAD0]">
              {judgment.citation}
            </span>
            <StatusBadge status={judgment.status} />
            <span className="text-xs text-[#747A62]">
              Pronounced: {judgment.judgmentDate}
            </span>
          </div>

          <h1 className="font-editorial text-xl sm:text-2xl font-bold text-[#252A29] tracking-tight pt-1">
            {judgment.title}
          </h1>

          <p className="text-xs text-[#252A29] flex items-center pt-0.5 font-medium">
            <Scale className="w-3.5 h-3.5 mr-1.5 text-[#747A62] shrink-0" />
            {judgment.court}
          </p>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-4 border-t border-[#DEDAD0] text-xs">
          <div className="p-3 bg-[#F4F2EC]/60 rounded-[6px] border border-[#DEDAD0]">
            <span className="text-[#747A62] block text-[11px] uppercase tracking-wider font-semibold">
              Bench Composition
            </span>
            <span className="font-semibold text-[#252A29] mt-0.5 block">
              {judgment.bench || 'Division / Single Bench'}
            </span>
          </div>

          <div className="p-3 bg-[#F4F2EC]/60 rounded-[6px] border border-[#DEDAD0]">
            <span className="text-[#747A62] block text-[11px] uppercase tracking-wider font-semibold">
              Petitioner / Appellant
            </span>
            <span className="font-semibold text-[#252A29] mt-0.5 block">
              {judgment.parties?.petitioner || 'Not Specified'}
            </span>
          </div>

          <div className="p-3 bg-[#F4F2EC]/60 rounded-[6px] border border-[#DEDAD0]">
            <span className="text-[#747A62] block text-[11px] uppercase tracking-wider font-semibold">
              Respondent / Opponent
            </span>
            <span className="font-semibold text-[#252A29] mt-0.5 block">
              {judgment.parties?.respondent || 'Not Specified'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Comprehensive Tabs Navigation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] shadow-2xs overflow-hidden">
            {/* Nav Tabs */}
            <div className="flex border-b border-[#DEDAD0] bg-[#F4F2EC]/60 text-xs font-medium overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap flex items-center ${
                  activeTab === 'summary'
                    ? 'border-[#A48658] text-[#252A29] bg-[#FFFFFF] font-semibold'
                    : 'border-transparent text-[#747A62] hover:text-[#252A29]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-[#A48658]" />
                Summary
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('facts')}
                className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap flex items-center ${
                  activeTab === 'facts'
                    ? 'border-[#A48658] text-[#252A29] bg-[#FFFFFF] font-semibold'
                    : 'border-transparent text-[#747A62] hover:text-[#252A29]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 mr-1.5 text-[#747A62]" />
                Facts
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('issues')}
                className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap flex items-center ${
                  activeTab === 'issues'
                    ? 'border-[#A48658] text-[#252A29] bg-[#FFFFFF] font-semibold'
                    : 'border-transparent text-[#747A62] hover:text-[#252A29]'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-[#747A62]" />
                Legal Issues
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('arguments')}
                className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap flex items-center ${
                  activeTab === 'arguments'
                    ? 'border-[#A48658] text-[#252A29] bg-[#FFFFFF] font-semibold'
                    : 'border-transparent text-[#747A62] hover:text-[#252A29]'
                }`}
              >
                <Scale className="w-3.5 h-3.5 mr-1.5 text-[#747A62]" />
                Arguments
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reasoning')}
                className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap flex items-center ${
                  activeTab === 'reasoning'
                    ? 'border-[#A48658] text-[#252A29] bg-[#FFFFFF] font-semibold'
                    : 'border-transparent text-[#747A62] hover:text-[#252A29]'
                }`}
              >
                <Gavel className="w-3.5 h-3.5 mr-1.5 text-[#747A62]" />
                Reasoning & Ratio
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('principles')}
                className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap flex items-center ${
                  activeTab === 'principles'
                    ? 'border-[#A48658] text-[#252A29] bg-[#FFFFFF] font-semibold'
                    : 'border-transparent text-[#747A62] hover:text-[#252A29]'
                }`}
              >
                <ScrollText className="w-3.5 h-3.5 mr-1.5 text-[#747A62]" />
                Principles
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('authorities')}
                className={`px-4 py-3 border-b-2 transition-all whitespace-nowrap flex items-center ${
                  activeTab === 'authorities'
                    ? 'border-[#A48658] text-[#252A29] bg-[#FFFFFF] font-semibold'
                    : 'border-transparent text-[#747A62] hover:text-[#252A29]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 mr-1.5 text-[#747A62]" />
                Authorities
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6">
              {/* 1. EXECUTIVE SUMMARY */}
              {activeTab === 'summary' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DEDAD0]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#747A62]">
                      Executive Brief
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(judgment.summary || '', 'summary')}
                      className="inline-flex items-center text-xs text-[#A48658] hover:underline"
                    >
                      {copiedSection === 'summary' ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" /> Copy Summary
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-xs sm:text-sm text-[#252A29] leading-relaxed font-serif space-y-3">
                    <p className="text-justify">{judgment.summary}</p>
                  </div>

                  {/* Operative Order Quick Box */}
                  <div className="mt-4 p-4 rounded-[6px] bg-[#F4F2EC]/70 border border-[#DEDAD0] space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A48658] block">
                      Operative Order / Final Judgment
                    </span>
                    <p className="text-xs text-[#252A29] font-medium leading-relaxed">
                      {finalJudgment}
                    </p>
                  </div>
                </div>
              )}

              {/* 2. FACTS OF THE CASE */}
              {activeTab === 'facts' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DEDAD0]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#747A62]">
                      Facts of the Case ({facts.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(facts.join('\n\n'), 'facts')}
                      className="inline-flex items-center text-xs text-[#A48658] hover:underline"
                    >
                      {copiedSection === 'facts' ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" /> Copy Facts
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {facts.map((fact, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-[6px] bg-[#F4F2EC]/60 border border-[#DEDAD0] text-xs text-[#252A29] flex items-start space-x-3"
                      >
                        <span className="w-5 h-5 rounded-full bg-[#252A29] text-[#FFFFFF] flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{fact}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. LEGAL ISSUES */}
              {activeTab === 'issues' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DEDAD0]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#747A62]">
                      Substantive Legal Issues Framed ({legalIssues.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(legalIssues.join('\n\n'), 'issues')}
                      className="inline-flex items-center text-xs text-[#A48658] hover:underline"
                    >
                      {copiedSection === 'issues' ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" /> Copy Issues
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {legalIssues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-[6px] bg-[#F4F2EC]/60 border border-[#DEDAD0] text-xs text-[#252A29] space-y-1"
                      >
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#A48658] font-bold">
                          Issue {idx + 1}
                        </span>
                        <p className="font-semibold leading-relaxed">{issue}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. ARGUMENTS */}
              {activeTab === 'arguments' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DEDAD0]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#747A62]">
                      Arguments from Both Parties
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          `PETITIONER:\n${argumentsData.petitioner.join('\n')}\n\nRESPONDENT:\n${argumentsData.respondent.join('\n')}`,
                          'arguments'
                        )
                      }
                      className="inline-flex items-center text-xs text-[#A48658] hover:underline"
                    >
                      {copiedSection === 'arguments' ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" /> Copy Arguments
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Petitioner Contentions */}
                    <div className="p-4 rounded-[6px] bg-[#F4F2EC]/60 border border-[#DEDAD0] space-y-3">
                      <span className="text-xs font-bold text-[#252A29] uppercase tracking-wide block pb-1 border-b border-[#DEDAD0]">
                        Petitioner / Appellant Submissions
                      </span>
                      <ul className="space-y-2.5 text-xs text-[#252A29]">
                        {argumentsData.petitioner.map((arg, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-[#A48658] font-bold">•</span>
                            <span className="leading-relaxed">{arg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Respondent Contentions */}
                    <div className="p-4 rounded-[6px] bg-[#F4F2EC]/60 border border-[#DEDAD0] space-y-3">
                      <span className="text-xs font-bold text-[#252A29] uppercase tracking-wide block pb-1 border-b border-[#DEDAD0]">
                        Respondent / Opponent Submissions
                      </span>
                      <ul className="space-y-2.5 text-xs text-[#252A29]">
                        {argumentsData.respondent.map((arg, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <span className="text-[#713F42] font-bold">•</span>
                            <span className="leading-relaxed">{arg}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. REASONING & RATIO DECIDENDI */}
              {activeTab === 'reasoning' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DEDAD0]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#747A62]">
                      Judicial Reasoning & Ratio Decidendi
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          `RATIO DECIDENDI:\n${ratioDecidendi}\n\nCOURT'S REASONING:\n${courtsReasoning.join('\n')}`,
                          'reasoning'
                        )
                      }
                      className="inline-flex items-center text-xs text-[#A48658] hover:underline"
                    >
                      {copiedSection === 'reasoning' ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" /> Copy Ratio & Reasoning
                        </>
                      )}
                    </button>
                  </div>

                  {/* Ratio Decidendi Highlight Box */}
                  <div className="p-4 rounded-[6px] bg-[#A48658]/10 border border-[#A48658]/40 space-y-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#A48658] flex items-center">
                      <Gavel className="w-3.5 h-3.5 mr-1" />
                      Ratio Decidendi (Binding Legal Principle)
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-[#252A29] leading-relaxed">
                      "{ratioDecidendi}"
                    </p>
                  </div>

                  {/* Court's Reasoning Points */}
                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-semibold text-[#252A29] uppercase tracking-wide block">
                      Steps of Legal Reasoning:
                    </span>
                    {courtsReasoning.map((step, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-[6px] bg-[#F4F2EC]/60 border border-[#DEDAD0] text-xs text-[#252A29] flex items-start space-x-3"
                      >
                        <span className="w-5 h-5 rounded-[4px] bg-[#252A29] text-[#FFFFFF] flex items-center justify-center text-[10px] font-semibold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. IMPORTANT LEGAL PRINCIPLES */}
              {activeTab === 'principles' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DEDAD0]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#747A62]">
                      Established Principles & Jurisprudence ({keyPrinciples.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(keyPrinciples.join('\n'), 'principles')}
                      className="inline-flex items-center text-xs text-[#A48658] hover:underline"
                    >
                      {copiedSection === 'principles' ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" /> Copy Principles
                        </>
                      )}
                    </button>
                  </div>

                  <ul className="space-y-2.5">
                    {keyPrinciples.map((point, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-xs text-[#252A29] bg-[#F4F2EC]/60 p-3 rounded-[6px] border border-[#DEDAD0] hover:border-[#A48658]/40 transition-colors"
                      >
                        <span className="w-5 h-5 rounded-[4px] bg-[#252A29] text-[#FFFFFF] flex items-center justify-center text-[10px] font-semibold shrink-0 mr-3 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 7. CITED PRECEDENTS & STATUTES */}
              {activeTab === 'authorities' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DEDAD0]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#747A62]">
                      Precedents & Statutory Provisions
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleCopyText(
                          `CITED PRECEDENTS:\n${citationsList.join('\n')}\n\nRELEVANT STATUTES:\n${statutesList.join('\n')}`,
                          'authorities'
                        )
                      }
                      className="inline-flex items-center text-xs text-[#A48658] hover:underline"
                    >
                      {copiedSection === 'authorities' ? (
                        <>
                          <Check className="w-3 h-3 mr-1 text-emerald-600" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 mr-1" /> Copy Citations & Statutes
                        </>
                      )}
                    </button>
                  </div>

                  {/* Cited Precedents */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-semibold text-[#252A29] uppercase tracking-wide block">
                      Cited Judgments ({citationsList.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {citationsList.map((cite, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-[6px] bg-[#F4F2EC]/60 border border-[#DEDAD0] text-xs flex items-center justify-between"
                        >
                          <span className="text-[#A48658] font-semibold">{cite}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#747A62]" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Relevant Statutes */}
                  <div className="space-y-2.5 pt-3 border-t border-[#DEDAD0]">
                    <span className="text-xs font-semibold text-[#252A29] uppercase tracking-wide block">
                      Relevant Statutes & Provisions ({statutesList.length}):
                    </span>
                    <div className="space-y-2">
                      {statutesList.map((statute, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-[6px] bg-[#F4F2EC]/60 border border-[#DEDAD0] text-xs text-[#252A29] font-medium flex items-center space-x-2"
                        >
                          <BookMarked className="w-3.5 h-3.5 text-[#A48658] shrink-0" />
                          <span>{statute}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Document Preview & Export Quick Panel */}
        <div className="space-y-6">
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-5 space-y-4 shadow-2xs">
            <div className="flex items-center space-x-2 pb-2 border-b border-[#DEDAD0]">
              <FileText className="w-4 h-4 text-[#A48658]" />
              <h3 className="font-editorial text-sm font-bold text-[#252A29] uppercase tracking-wide">
                Document File & Actions
              </h3>
            </div>

            <div className="p-4 bg-[#F4F2EC]/70 rounded-[6px] border border-[#DEDAD0] text-center space-y-2">
              <FileText className="w-8 h-8 text-[#A48658] mx-auto" />
              <p className="text-xs font-semibold text-[#252A29] break-all">
                {judgment.fileName || 'judgment_copy.pdf'}
              </p>
              <p className="text-xs text-[#747A62]">
                {judgment.fileSize || '1.8 MB'} · PDF Document
              </p>

              <div className="space-y-1.5 pt-2">
                {pdfBlobUrl ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowPdfModal(true)}
                      className="w-full inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-[6px] bg-[#A48658]/15 text-[#685333] border border-[#A48658]/40 hover:bg-[#A48658]/25 transition-all"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5 text-[#A48658]" /> Preview Stored PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadOriginalPdf}
                      className="w-full inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-[6px] bg-[#FFFFFF] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC] transition-all"
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5 text-[#747A62]" /> Download Original PDF
                    </button>
                  </>
                ) : (
                  <p className="text-[11px] text-[#747A62] italic py-1">
                    Original document file not found in local IndexedDB store.
                  </p>
                )}

                <button
                  type="button"
                  onClick={handleDownloadLegalBrief}
                  className="w-full inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-2xs transition-all"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5 text-[#A48658]" /> Download Full Legal Brief (.txt)
                </button>
              </div>
            </div>

            <div className="text-xs text-[#747A62] space-y-2 pt-2 border-t border-[#DEDAD0]">
              <div className="flex items-center space-x-1.5 text-[#747A62]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#747A62]" />
                <span>Court certified transcript on record</span>
              </div>
              <p className="text-[11px] text-[#747A62]/80 leading-relaxed">
                Synthesis sections can be copied directly to clipboard for pleadings, research notes, and case strategy briefs.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Modal: Edit Judgment Metadata */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-[#252A29]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#DEDAD0] pb-2.5">
              <h3 className="text-sm font-bold text-[#252A29]">Edit Judgment Record</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="text-[#747A62] hover:text-[#252A29]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMetadata} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#252A29] font-medium mb-1">Case Cause Title *</label>
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
                  <label className="block text-[#252A29] font-medium mb-1">Suit / Case No. or Citation</label>
                  <input
                    type="text"
                    value={editCitation}
                    onChange={(e) => setEditCitation(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
                  />
                </div>

                <div>
                  <label className="block text-[#252A29] font-medium mb-1">Bench Composition</label>
                  <input
                    type="text"
                    value={editBench}
                    onChange={(e) => setEditBench(e.target.value)}
                    placeholder="e.g. Presiding District Judge"
                    className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
                  />
                </div>
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
                  <label className="block text-[#252A29] font-medium mb-1">Analysis Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Processing">Processing</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2.5 pt-3 border-t border-[#DEDAD0]">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
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

      {/* Modal: PDF Viewer Preview */}
      {showPdfModal && pdfBlobUrl && (
        <div className="fixed inset-0 z-50 bg-[#252A29]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] max-w-4xl w-full h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#DEDAD0] bg-[#F4F2EC]/80">
              <div className="flex items-center space-x-2 min-w-0">
                <FileText className="w-4 h-4 text-[#A48658] shrink-0" />
                <span className="text-xs font-semibold text-[#252A29] truncate">
                  {pdfRecord?.fileName || judgment.fileName || 'Judgment_Document.pdf'}
                </span>
                <span className="text-[10px] text-[#747A62] bg-[#FFFFFF] px-2 py-0.5 rounded border border-[#DEDAD0] shrink-0">
                  IndexedDB Stored
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleDownloadOriginalPdf}
                  className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-[4px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837]"
                >
                  <Download className="w-3 h-3 mr-1 text-[#A48658]" /> Download
                </button>
                <button
                  type="button"
                  onClick={() => setShowPdfModal(false)}
                  className="p-1 rounded text-[#747A62] hover:text-[#252A29] hover:bg-[#DEDAD0]/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 w-full bg-[#323837]">
              <iframe
                src={pdfBlobUrl}
                title="Judgment Document PDF Viewer"
                className="w-full h-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
