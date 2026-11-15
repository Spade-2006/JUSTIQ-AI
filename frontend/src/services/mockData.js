// Mock data removed in favor of dynamic localStorage store (see dataStorage.js)
// Default empty collections ensure no fabricated records are displayed.

export const mockJudgments = [];
export const mockCases = [];
export const mockHearings = [];
export const mockDashboardData = {
  stats: {
    totalJudgments: 0,
    activeCases: 0,
    upcomingHearings: 0,
    pendingSummaries: 0,
  },
  recentJudgments: [],
  upcomingHearings: [],
};
