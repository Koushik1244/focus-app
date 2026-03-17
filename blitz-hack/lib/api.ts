import { fallbackHistory } from './mockData';
import { SessionHistoryResponse } from './types';

const API_URL = 'http://localhost:3000';

export const fetchSessionHistory = async (wallet: string): Promise<SessionHistoryResponse> => {
  try {
    const response = await fetch(`${API_URL}/sessions/${wallet}`);
    if (!response.ok) {
      throw new Error(`History fetch failed with status ${response.status}`);
    }

    const data = (await response.json()) as Partial<SessionHistoryResponse>;
    return {
      sessions: data.sessions ?? fallbackHistory.sessions,
      streak: data.streak ?? fallbackHistory.streak,
    };
  } catch {
    return fallbackHistory;
  }
};

export const createSession = async (wallet: string, duration: number, stake: number) => {
  try {
    const response = await fetch(`${API_URL}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet, duration, stake }),
    });

    if (!response.ok) {
      throw new Error(`Create session failed with status ${response.status}`);
    }

    const data = (await response.json()) as { session?: { id?: string } };
    return data.session?.id ?? `demo_${Date.now()}`;
  } catch {
    return `demo_${Date.now()}`;
  }
};

export const settleSession = async (sessionId: string, focusScore: number) => {
  try {
    await fetch(`${API_URL}/sessions/${sessionId}/settle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ focusScore }),
    });
  } catch {
    // Demo fallback.
  }
};
