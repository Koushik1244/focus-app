export type AppTab = 'HOME' | 'STATS' | 'SOCIAL' | 'PROFILE';

export type SessionRecord = {
  id: string;
  duration: number;
  stake: number;
  focusScore: number | null;
  success: boolean | null;
  reward: number | null;
  createdAt: string;
};

export type SessionHistoryResponse = {
  sessions: SessionRecord[];
  streak: number;
};

export type LeaderboardEntry = {
  rank: number;
  wallet: string;
  initials: string;
  earned: number;
  sessions: number;
  isCurrentUser?: boolean;
};
