import { deletePDFFile } from './pdfStorage';

// Simple localStorage-based data management store for JUSTIQ
// Ensures all user-created records persist across page reloads without hardcoded mock data.

const STORAGE_KEYS = {
  JUDGMENTS: 'justiq_judgments_data',
  CASES: 'justiq_cases_data',
  HEARINGS: 'justiq_hearings_data',
  USER_PROFILE: 'justiq_auth_user',
};

// Safe JSON helper
function load(key, defaultVal) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return defaultVal;
  }
}

function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

// ---------------- USER PROFILE ----------------

export const DEFAULT_USER_PROFILE = {
  name: 'Adv. Rajesh Sharma',
  email: 'sharma.legal@delhibar.in',
  phone: '+91 98102 34567',
  barNumber: 'D/1482/2012',
  barAssociation: 'Tis Hazari District Court Bar Association',
  primaryPractice: 'Civil & Criminal Litigation',
  role: 'Advocate',
};

export function getUserProfile() {
  const stored = load(STORAGE_KEYS.USER_PROFILE, null);
  if (!stored) {
    save(STORAGE_KEYS.USER_PROFILE, DEFAULT_USER_PROFILE);
    return DEFAULT_USER_PROFILE;
  }
  return { ...DEFAULT_USER_PROFILE, ...stored };
}

export function saveUserProfile(profile) {
  save(STORAGE_KEYS.USER_PROFILE, profile);
  // Dispatch a storage event so components like Header and Sidebar update reactively
  window.dispatchEvent(new Event('justiq_profile_updated'));
  return profile;
}

// ---------------- JUDGMENTS ----------------

export function getJudgments() {
  return load(STORAGE_KEYS.JUDGMENTS, []);
}

export function getJudgmentById(id) {
  const judgments = getJudgments();
  return judgments.find((j) => j.id === id) || null;
}

export function saveJudgment(judgment) {
  const judgments = getJudgments();
  const existingIndex = judgments.findIndex((j) => j.id === judgment.id);

  let updated;
  if (existingIndex !== -1) {
    updated = [...judgments];
    updated[existingIndex] = judgment;
  } else {
    updated = [judgment, ...judgments];
  }

  save(STORAGE_KEYS.JUDGMENTS, updated);
  return judgment;
}

export function deleteJudgment(id) {
  const judgments = getJudgments();
  const filtered = judgments.filter((j) => j.id !== id);
  save(STORAGE_KEYS.JUDGMENTS, filtered);

  // Also remove physical PDF file from IndexedDB
  deletePDFFile(id).catch((err) => {
    console.error('Failed to clean up PDF from IndexedDB:', err);
  });

  // Also remove from any associated cases
  const cases = getCases();
  const updatedCases = cases.map((c) => ({
    ...c,
    associatedJudgments: (c.associatedJudgments || []).filter((aj) => aj.id !== id),
  }));
  save(STORAGE_KEYS.CASES, updatedCases);

  return true;
}

// ---------------- CASES ----------------

export function getCases() {
  return load(STORAGE_KEYS.CASES, []);
}

export function getCaseById(id) {
  const cases = getCases();
  return cases.find((c) => c.id === id) || null;
}

export function saveCase(caseItem) {
  const cases = getCases();
  const existingIndex = cases.findIndex((c) => c.id === caseItem.id);

  let updated;
  if (existingIndex !== -1) {
    updated = [...cases];
    updated[existingIndex] = caseItem;
  } else {
    updated = [caseItem, ...cases];
  }

  save(STORAGE_KEYS.CASES, updated);
  return caseItem;
}

export function deleteCase(id) {
  const cases = getCases();
  const filtered = cases.filter((c) => c.id !== id);
  save(STORAGE_KEYS.CASES, filtered);

  // Also delete associated hearings for this case
  const hearings = getHearings();
  const filteredHearings = hearings.filter((h) => h.caseId !== id);
  save(STORAGE_KEYS.HEARINGS, filteredHearings);

  return true;
}

// ---------------- HEARINGS ----------------

export function getHearings() {
  return load(STORAGE_KEYS.HEARINGS, []);
}

export function getHearingById(id) {
  const hearings = getHearings();
  return hearings.find((h) => h.id === id) || null;
}

export function saveHearing(hearing) {
  const hearings = getHearings();
  const existingIndex = hearings.findIndex((h) => h.id === hearing.id);

  let updated;
  if (existingIndex !== -1) {
    updated = [...hearings];
    updated[existingIndex] = hearing;
  } else {
    updated = [hearing, ...hearings];
  }

  save(STORAGE_KEYS.HEARINGS, updated);

  // Synchronize with the linked case's hearing history and nextHearing
  if (hearing.caseId) {
    const caseRecord = getCaseById(hearing.caseId);
    if (caseRecord) {
      const caseHearings = caseRecord.hearings || [];
      const hIdx = caseHearings.findIndex((h) => h.id === hearing.id);
      let updatedCaseHearings;
      if (hIdx !== -1) {
        updatedCaseHearings = [...caseHearings];
        updatedCaseHearings[hIdx] = hearing;
      } else {
        updatedCaseHearings = [hearing, ...caseHearings];
      }

      // Update next hearing if applicable
      const isUpcoming = hearing.status === 'Upcoming' || hearing.status === 'Scheduled';
      const updatedCase = {
        ...caseRecord,
        hearings: updatedCaseHearings,
        ...(isUpcoming
          ? {
              nextHearing: hearing.date,
              nextHearingTime: hearing.time,
              courtRoom: hearing.courtRoom,
              purpose: hearing.purpose,
            }
          : {}),
      };
      saveCase(updatedCase);
    }
  }

  return hearing;
}

export function deleteHearing(id) {
  const hearings = getHearings();
  const target = hearings.find((h) => h.id === id);
  const filtered = hearings.filter((h) => h.id !== id);
  save(STORAGE_KEYS.HEARINGS, filtered);

  // Remove from linked case
  if (target?.caseId) {
    const caseRecord = getCaseById(target.caseId);
    if (caseRecord) {
      const updatedCaseHearings = (caseRecord.hearings || []).filter((h) => h.id !== id);
      saveCase({
        ...caseRecord,
        hearings: updatedCaseHearings,
        ...(caseRecord.nextHearing === target.date ? { nextHearing: 'None', purpose: '' } : {}),
      });
    }
  }

  return true;
}

// ---------------- DASHBOARD DYNAMIC METRICS ----------------

export function getDashboardMetrics() {
  const judgments = getJudgments();
  const cases = getCases();
  const hearings = getHearings();

  const totalJudgments = judgments.length;
  const activeCases = cases.filter((c) => c.status === 'Active').length;
  const upcomingHearings = hearings.filter(
    (h) => (h.status || '').toLowerCase() === 'upcoming'
  ).length;
  const completedSummaries = judgments.filter(
    (j) => (j.status || '').toLowerCase() === 'completed'
  ).length;

  return {
    stats: {
      totalJudgments,
      activeCases,
      upcomingHearings,
      completedSummaries,
    },
    recentJudgments: judgments.slice(0, 5),
    upcomingHearingsList: hearings
      .filter((h) => (h.status || '').toLowerCase() === 'upcoming')
      .slice(0, 5),
  };
}
