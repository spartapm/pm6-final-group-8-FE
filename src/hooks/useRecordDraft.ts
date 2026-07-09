'use client';

import { create } from 'zustand';
import type { ExperienceCategoryId } from '@/lib/constants/categories';

export interface ChatMessage {
  role: 'bot' | 'user';
  content: string;
  sortOrder: number;
}

interface RecordDraft {
  recordDate: string;
  category: ExperienceCategoryId | null;
  emotionLevel: number;
  messages: ChatMessage[];
  setRecordDate: (date: string) => void;
  setCategory: (category: ExperienceCategoryId) => void;
  setEmotionLevel: (level: number) => void;
  addMessage: (msg: ChatMessage) => void;
  reset: () => void;
}

export const useRecordDraft = create<RecordDraft>((set) => ({
  recordDate: new Date().toISOString().slice(0, 10),
  category: null,
  emotionLevel: 3,
  messages: [],
  setRecordDate: (recordDate) => set({ recordDate }),
  setCategory: (category) => set({ category }),
  setEmotionLevel: (emotionLevel) => set({ emotionLevel }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  reset: () =>
    set({
      recordDate: new Date().toISOString().slice(0, 10),
      category: null,
      emotionLevel: 3,
      messages: [],
    }),
}));
