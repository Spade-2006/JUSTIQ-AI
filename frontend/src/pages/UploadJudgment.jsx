import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  X,
  FileCheck,
  Sparkles,
  Loader2,
  RotateCcw,
  Check,
  Info,
} from 'lucide-react';
import { saveJudgment } from '../services/dataStorage';
import { storePDFFile } from '../services/pdfStorage';

const PROCESSING_STEPS = [
  { id: 'upload', label: 'PDF Text Extraction & OCR Parsing' },
  { id: 'facts', label: 'Extracting Procedural History & Facts' },
  { id: 'issues', label: 'Isolating Substantive Legal Questions' },
  { id: 'arguments', label: 'Synthesizing Petitioner & Respondent Contentions' },
  { id: 'reasoning', label: 'Structuring Ratio Decidendi & Judicial Reasoning' },
  { id: 'statutes', label: 'Mapping Precedents & Statutory Provisions' },
];

export function UploadJudgment() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [court, setCourt] = useState('Principal District & Sessions Court, Central');
  const [citation, setCitation] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  // Processing state
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedJudgmentId, setCompletedJudgmentId] = useState(null);

  const handleFileSelection = (file) => {
    setError('');
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Invalid file format. Please upload an authentic judgment in PDF format.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setError('File exceeds maximum size of 25MB. Please upload a compressed court copy.');
      return;
    }

    setSelectedFile(file);

    if (!title) {
      const generatedTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
      setTitle(generatedTitle);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleBrowseFiles = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Start processing simulation
  const startProcessing = () => {
    setError('');
    setIsProcessing(true);
    setCurrentStepIndex(0);

    const createdId = `j-${Date.now().toString().slice(-4)}`;
    const currentYear = new Date().getFullYear();
    const generatedCitation = citation.trim() || `CS (OS) ${Math.floor(Math.random() * 800) + 100}/${currentYear}`;

    // Step-by-step processing ticker
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      if (step < PROCESSING_STEPS.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);

        // Build comprehensive structured legal analysis record
        const petitionerName = title.includes(' v. ')
          ? title.split(' v. ')[0]
          : title.includes(' vs ')
          ? title.split(' vs ')[0]
          : 'Plaintiff / Complainant';

        const respondentName = title.includes(' v. ')
          ? title.split(' v. ')[1]
          : title.includes(' vs ')
          ? title.split(' vs ')[1]
          : 'Defendant / Accused';

        const structuredRecord = {
          id: createdId,
          title: title.trim(),
          court,
          citation: generatedCitation,
          judgmentDate: new Date().toISOString().split('T')[0],
          status: 'Completed',
          fileName: selectedFile.name,
          fileSize: formatFileSize(selectedFile.size),
          bench: 'Presiding District Judge',
          parties: {
            petitioner: petitionerName.trim(),
            respondent: respondentName.trim(),
          },

          // 1. Executive Summary
          summary: description.trim() || `In ${title.trim()}, the ${court} adjudicated issues regarding contract enforcement, recovery of dues, and evidentiary adherence under civil procedure rules. The Court held that strict compliance with procedural pleadings and admissible commercial proof must govern district civil adjudication, holding that claims supported by verified accounts and contemporaneous documentary evidence warrant a decree.`,

          // 2. Facts of the Case
          facts: [
            `The plaintiff instituted a civil suit before the District Court seeking recovery of outstanding commercial dues with interest along with perpetual injunction against the defendant.`,
            `The defendant filed written statements denying execution of invoices and alleged substandard delivery of goods while raising preliminary objections on territorial jurisdiction and limitation.`,
            `Issues were framed by the learned District Judge regarding execution of agreements, proof of delivery, maintainability under the Commercial Courts Act, and entitlement to decree.`,
          ],

          // 3. Legal Issues Framed
          legalIssues: [
            `Whether the suit is filed within prescribed limitation under the Limitation Act, 1963 and maintainable before this District Court.`,
            `Whether the plaintiff has established delivery of consignment and validity of invoices marked in evidence as Exhibit PW-1/A through PW-1/D.`,
            `Whether the defendant is entitled to adjust payments or avoid liability on oral allegations of defective consignment absent contemporary notice.`,
          ],

          // 4. Arguments from Both Parties
          arguments: {
            petitioner: [
              `Submitted that goods were delivered against duly acknowledged delivery challans and verified e-way bills produced on judicial record.`,
              `Argued that ledger accounts maintained in ordinary course of business corroborated by bank statements establish liability under Section 34 of Evidence Act.`,
              `Contended that no written protest regarding defect was ever dispatched by defendant prior to receipt of statutory demand notice.`,
            ],
            respondent: [
              `Argued that the District Court lacked pecuniary jurisdiction based on amended valuation rules under local Court Fees enactments.`,
              `Claimed that partial payments made were not credited in the statement of account filed with the plaint.`,
              `Submitted that time was the essence of the contract and failure to supply by agreed date caused irreparable business loss.`,
            ],
          },

          // 5. Court's Reasoning
          courtsReasoning: [
            `The Court evaluated oral and documentary evidence on record, noting PW-1 was subjected to extensive cross-examination without substantive contradictions emerging on core delivery vouchers.`,
            `Held that bare denials in written statement without documentary foundation do not satisfy the standard of proof required under Order VIII Rule 5 of CPC.`,
            `Examined certified bank records and held defendant failed to lead cogent rebuttal evidence under Section 102 of Indian Evidence Act.`,
          ],

          // 6. Ratio Decidendi
          ratioDecidendi: `In commercial recovery suits before the District Court, contemporaneous delivery acknowledgements accompanied by audited ledger statements establish a prima facie case; mere oral assertions of defective supply without prompt written rejection do not absolve contractual liability.`,

          // 7. Final Judgment / Operative Order
          finalJudgment: `Suit of the plaintiff is decreed with costs. The defendant is directed to pay the principal sum along with pendente lite and future interest at 9% per annum from the date of filing until realization. Decree sheet be drawn accordingly.`,

          // 8. Important Legal Principles
          keyPoints: [
            `Burden of Proof in Civil Suits: Plaintiff must discharge primary onus of proving delivery and consideration before onus shifts to defendant.`,
            `Admissibility of Commercial Records: Electronic invoices and bank statements with certificate under Section 65B of Evidence Act are admissible.`,
            `Doctrine of Deemed Admission: Failure to specifically traverse averments in written statement operates as an admission under CPC Order VIII Rule 5.`,
            `Discretionary Commercial Interest: District Courts may award reasonable pendente lite and future interest commensurate with commercial borrowing rates.`,
          ],

          // 9. Cited Judgments (Precedents)
          citations: [
            generatedCitation,
            'Civil Suit No. 412 of 2021 (Tis Hazari District Court)',
            'Execution Case No. 88/2023 (Saket District Court)',
            'Commercial Suit No. 19/2022 (Patiala House District Court)',
            'Arbitration Petition (Dist.) 34/2020 (Rouse Avenue)',
          ],

          // 10. Relevant Statutes
          relevantStatutes: [
            'Code of Civil Procedure, 1908 — Order VII, Order VIII & Order XXXVII',
            'Indian Contract Act, 1872 — Section 73 & Section 74',
            'Indian Evidence Act, 1872 / BSA 2023 — Section 34 & Section 65B',
            'Commercial Courts Act, 2015 — Section 2(1)(c) & Section 12A',
            'Limitation Act, 1963 — Article 14 & Article 55',
          ],
        };

        // Persist file into IndexedDB so it can be previewed/downloaded after refresh
        storePDFFile(createdId, selectedFile, selectedFile.name).catch((fileErr) => {
          console.warn('Could not cache file blob into IndexedDB:', fileErr);
        });

        saveJudgment(structuredRecord);
        setIsProcessing(false);
        setCompletedJudgmentId(createdId);
      }
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!selectedFile) {
      setError('Please attach or drop a judgment PDF file to proceed.');
      return;
    }

    if (!title.trim()) {
      setError('Judgment title is mandatory for legal indexing.');
      return;
    }

    startProcessing();
  };

  // Allow triggering a simulated failure to demonstrate retry functionality
  const handleTriggerSimulatedFailure = () => {
    setIsProcessing(false);
    setError('Document parsing error: PDF stream contains corrupt or encrypted text layers. Please retry or upload an unencrypted file.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#DEDAD0] flex items-baseline justify-between">
        <div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#252A29] tracking-tight">
            AI Judgment Analysis & Ingestion
          </h2>
          <p className="text-xs sm:text-sm text-[#747A62] mt-0.5 font-serif italic">
            Automated procedural indexing, ratio decidendi extraction, and structured case synthesis.
          </p>
        </div>

        <Link
          to="/judgments"
          className="inline-flex items-center text-xs font-medium text-[#747A62] hover:text-[#252A29] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Archive
        </Link>
      </div>

      {/* Demo Mode Notice */}
      <div className="p-3 bg-[#A48658]/10 rounded-[6px] border border-[#A48658]/35 flex items-start space-x-2.5 text-xs text-[#685333]">
        <Info className="w-4 h-4 text-[#A48658] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-semibold text-[#252A29]">
            DEMO MODE · Simulated Analysis Engine
          </p>
          <p className="text-[11px] text-[#747A62] leading-relaxed">
            This demonstrator uses rule-based structural synthesis with mock processing stages to illustrate the full judicial extraction experience without external cloud GPU costs.
          </p>
        </div>
      </div>

      {/* Processing Progress Stage Display */}
      {isProcessing && (
        <div className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#DEDAD0]">
            <div className="flex items-center space-x-2.5">
              <Loader2 className="w-5 h-5 text-[#A48658] animate-spin" />
              <div>
                <h3 className="text-sm font-bold text-[#252A29]">
                  Analyzing Judgment Document
                </h3>
                <p className="text-xs text-[#747A62]">
                  {selectedFile?.name} ({formatFileSize(selectedFile?.size || 0)})
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#A48658]">
              Stage {currentStepIndex + 1} of {PROCESSING_STEPS.length}
            </span>
          </div>

          {/* Step Progress Checklist */}
          <div className="space-y-2.5">
            {PROCESSING_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`flex items-center justify-between p-2.5 rounded-[6px] border text-xs transition-all ${
                    isCompleted
                      ? 'bg-[#747A62]/10 border-[#747A62]/35 text-[#252A29]'
                      : isCurrent
                      ? 'bg-[#A48658]/10 border-[#A48658]/40 text-[#252A29] font-semibold'
                      : 'bg-[#F4F2EC]/40 border-[#DEDAD0]/60 text-[#747A62]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {isCompleted ? (
                      <span className="w-4 h-4 rounded-full bg-[#747A62] text-[#FFFFFF] flex items-center justify-center text-[10px]">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-[#A48658] animate-spin" />
                    ) : (
                      <span className="w-4 h-4 rounded-full border border-[#DEDAD0] text-[#747A62] flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                    )}
                    <span>{step.label}</span>
                  </div>

                  {isCompleted && (
                    <span className="text-[11px] text-[#747A62] font-mono">Done</span>
                  )}
                  {isCurrent && (
                    <span className="text-[11px] text-[#A48658] font-mono">In Progress</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex justify-between items-center text-xs text-[#747A62]">
            <span>Running automated legal parser...</span>
            <button
              type="button"
              onClick={handleTriggerSimulatedFailure}
              className="text-[11px] text-[#713F42] hover:underline"
              title="Test the error state and retry workflow"
            >
              Simulate Failure
            </button>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {completedJudgmentId && !isProcessing && (
        <div className="p-5 rounded-[8px] bg-[#747A62]/10 border border-[#747A62]/35 text-[#252A29] flex items-start space-x-3.5 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-[#747A62] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm text-[#252A29]">Analysis Complete</h4>
            <p className="text-[#747A62] mt-0.5 leading-relaxed">
              Legal propositions, facts, issues, arguments, reasoning, and ratio decidendi have been structured and saved to your chambers archive.
            </p>
            <div className="mt-3 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate(`/judgments/${completedJudgmentId}`)}
                className="px-4 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all"
              >
                Open Full Analysis Brief
              </button>
              <button
                type="button"
                onClick={() => {
                  setCompletedJudgmentId(null);
                  setSelectedFile(null);
                  setTitle('');
                  setDescription('');
                  setCitation('');
                }}
                className="text-xs text-[#A48658] font-semibold hover:underline"
              >
                Analyze another judgment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert with Retry Functionality */}
      {error && !isProcessing && (
        <div className="p-4 rounded-[8px] bg-[#713F42]/10 border border-[#713F42]/30 text-[#713F42] flex items-start space-x-3 text-xs shadow-2xs">
          <AlertCircle className="w-4 h-4 text-[#713F42] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Processing Interrupted</p>
            <p className="mt-0.5 leading-relaxed">{error}</p>
            <div className="mt-2.5">
              <button
                type="button"
                onClick={startProcessing}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-[4px] bg-[#713F42] text-[#FFFFFF] hover:bg-[#713F42]/90 shadow-2xs"
              >
                <RotateCcw className="w-3 h-3 mr-1.5" /> Retry Processing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Form */}
      {!isProcessing && !completedJudgmentId && (
        <form onSubmit={handleSubmit} className="bg-[#FFFFFF] rounded-[8px] border border-[#DEDAD0] p-6 space-y-5 shadow-2xs">
          {/* Dropzone */}
          <div>
            <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider mb-2">
              1. Document File Attachment <span className="text-[#713F42]">*</span>
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-[8px] p-8 text-center transition-all ${
                isDragging
                  ? 'border-[#A48658] bg-[#A48658]/5'
                  : selectedFile
                  ? 'border-[#747A62]/50 bg-[#747A62]/5'
                  : 'border-[#DEDAD0] hover:border-[#A48658]/50 bg-[#F4F2EC]/40'
              }`}
            >
              {selectedFile ? (
                <div className="flex items-center justify-between p-3.5 bg-[#FFFFFF] rounded-[6px] border border-[#DEDAD0]">
                  <div className="flex items-center space-x-3 text-left overflow-hidden">
                    <div className="w-9 h-9 rounded-[6px] bg-[#747A62]/10 border border-[#747A62]/30 flex items-center justify-center shrink-0">
                      <FileCheck className="w-5 h-5 text-[#747A62]" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-[#252A29] truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-[#747A62]">
                        {formatFileSize(selectedFile.size)} · PDF Document
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-1.5 rounded text-[#747A62] hover:text-[#713F42] hover:bg-[#713F42]/10 ml-2 shrink-0 transition-colors"
                    title="Remove document"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-[8px] bg-[#F4F2EC] border border-[#DEDAD0] flex items-center justify-center text-[#747A62]">
                    <Upload className="w-6 h-6 text-[#A48658]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#252A29]">
                      Drop official judgment PDF here, or{' '}
                      <label className="text-[#A48658] hover:underline cursor-pointer">
                        browse local drive
                        <input
                          type="file"
                          accept=".pdf,application/pdf"
                          onChange={handleBrowseFiles}
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="text-[11px] text-[#747A62] mt-1">
                      Accepts certified court copies and law report transcripts up to 25MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider mb-1">
              2. Case Cause Title <span className="text-[#713F42]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. State of Karnataka v. Union of India & Ors."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF] transition-all"
            />
          </div>

          {/* Court and Citation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider mb-1">
                3. District Court Division / Jurisdiction
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

            <div>
              <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider mb-1">
                4. Suit / Case Number or Citation (Optional)
              </label>
              <input
                type="text"
                value={citation}
                onChange={(e) => setCitation(e.target.value)}
                placeholder="e.g. CS (COMM) 142/2024"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-semibold text-[#252A29] uppercase tracking-wider mb-1">
              5. Preliminary Case Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Notes on issues framed, key statutory provisions, or instructions for the pipeline..."
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#F4F2EC] border border-[#DEDAD0] rounded-[6px] text-[#252A29] focus:outline-none focus:border-[#A48658] focus:bg-[#FFFFFF]"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-[#DEDAD0]">
            <button
              type="button"
              onClick={() => navigate('/judgments')}
              className="px-4 py-2 text-xs font-medium rounded-[6px] border border-[#DEDAD0] text-[#252A29] hover:bg-[#F4F2EC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile}
              className="inline-flex items-center px-5 py-2 text-xs font-semibold rounded-[6px] bg-[#252A29] text-[#FFFFFF] hover:bg-[#323837] shadow-sm transition-all disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 mr-2 text-[#A48658]" />
              Start AI Processing
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
