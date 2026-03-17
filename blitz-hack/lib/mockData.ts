import { LeaderboardEntry, SessionHistoryResponse } from './types';

export const fallbackHistory: SessionHistoryResponse = {
  streak: 7,
  sessions: [
    {
      id: 'demo-1',
      duration: 45,
      stake: 5,
      focusScore: 94,
      success: true,
      reward: 6.83,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      duration: 25,
      stake: 1,
      focusScore: 88,
      success: true,
      reward: 1.25,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'demo-3',
      duration: 60,
      stake: 10,
      focusScore: 0,
      success: false,
      reward: 0,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 'demo-4',
      duration: 90,
      stake: 5,
      focusScore: 96,
      success: true,
      reward: 10.38,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ],
};

export const leaderboardWeekly: LeaderboardEntry[] = [
  { rank: 1, wallet: '0x8fa1...2bd4', initials: 'AK', earned: 142.6, sessions: 22 },
  { rank: 2, wallet: '0x11ce...90ef', initials: 'RV', earned: 131.4, sessions: 19 },
  { rank: 3, wallet: '0x77dd...8aa1', initials: 'MK', earned: 118.9, sessions: 18 },
  { rank: 4, wallet: 'demo_wallet', initials: 'FS', earned: 97.2, sessions: 16, isCurrentUser: true },
  { rank: 5, wallet: '0x3322...fed1', initials: 'JT', earned: 91.5, sessions: 15 },
  { rank: 6, wallet: '0xb5ca...47a2', initials: 'AP', earned: 82.2, sessions: 14 },
  { rank: 7, wallet: '0x98ef...c220', initials: 'NS', earned: 74.4, sessions: 12 },
  { rank: 8, wallet: '0x5a41...f901', initials: 'DL', earned: 70.8, sessions: 11 },
  { rank: 9, wallet: '0x7bc2...98f0', initials: 'QH', earned: 64.1, sessions: 10 },
  { rank: 10, wallet: '0x1010...aaaa', initials: 'XR', earned: 58.7, sessions: 9 },
];

export const leaderboardAllTime: LeaderboardEntry[] = leaderboardWeekly.map((entry, index) => ({
  ...entry,
  rank: index + 1,
  earned: Number((entry.earned * 4.6).toFixed(1)),
  sessions: entry.sessions * 5,
}));
