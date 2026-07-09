import type { RecordMessage, RecordTag } from '@/types';

export interface QaPair {
  question: string;
  answer: string;
  tags?: RecordTag[];
}

export function parseQaPairs(messages: RecordMessage[]): QaPair[] {
  const sorted = [...messages].sort(
    (a, b) => (a.sortOrder ?? a.sort_order ?? 0) - (b.sortOrder ?? b.sort_order ?? 0),
  );
  const pairs: QaPair[] = [];
  let currentQ = '';

  for (const msg of sorted) {
    if (msg.role === 'bot') {
      currentQ = msg.content;
    } else if (msg.role === 'user' && currentQ) {
      pairs.push({
        question: currentQ,
        answer: msg.content.trim() || '없음',
      });
      currentQ = '';
    }
  }

  return pairs;
}

export function highlightEvidence(text: string, evidence?: string) {
  if (!evidence || !text.includes(evidence)) return text;
  const idx = text.indexOf(evidence);
  return {
    before: text.slice(0, idx),
    evidence: text.slice(idx, idx + evidence.length),
    after: text.slice(idx + evidence.length),
  };
}
