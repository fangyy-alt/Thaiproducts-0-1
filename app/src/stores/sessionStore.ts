'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TarotCard } from '@/types/session';

type ReadingPhase = 'idle' | 'streaming' | 'complete' | 'error' | 'crisis';

interface SessionState {
  sessionId: string | null;
  card: TarotCard | null;
  confessDraft: string;
  readingText: string;
  readingPhase: ReadingPhase;
}

interface SessionActions {
  setSessionId: (id: string) => void;
  setCard: (card: TarotCard) => void;
  setConfessDraft: (text: string) => void;
  appendReadingChunk: (chunk: string) => void;
  setReadingText: (text: string) => void;
  setReadingPhase: (phase: ReadingPhase) => void;
  reset: () => void;
}

const initial: SessionState = {
  sessionId: null,
  card: null,
  confessDraft: '',
  readingText: '',
  readingPhase: 'idle',
};

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set) => ({
      ...initial,
      setSessionId: (id) => set({ sessionId: id }),
      setCard: (card) => set({ card }),
      setConfessDraft: (text) => set({ confessDraft: text }),
      appendReadingChunk: (chunk) =>
        set((s) => ({ readingText: s.readingText + chunk })),
      setReadingText: (text) => set({ readingText: text }),
      setReadingPhase: (phase) => set({ readingPhase: phase }),
      reset: () => set({ ...initial }),
    }),
    {
      name: 'hug-session-draft',
      // 仅持久化草稿；reading 内容不持久化（隐私 + 流式重连复杂度）
      partialize: (s) => ({ confessDraft: s.confessDraft, card: s.card }),
    },
  ),
);
