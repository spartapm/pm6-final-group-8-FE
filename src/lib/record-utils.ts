import {
  EXTRA_ANSWER_QUESTION,
  EXTRA_INPUT_PROMPT,
  EXTRA_MORE_LABEL,
  EXTRA_QUESTION,
  EXTRA_SAVE_LABEL,
} from '@/lib/constants/questions';
import type { RecordMessage, RecordTag } from '@/types';

export interface QaPair {
  question: string;
  answer: string;
  tags?: RecordTag[];
}

/** 완료/상세에 노출하지 않을 메타 질문·선택지 */
const HIDDEN_QA_CONTENTS = new Set([
  EXTRA_QUESTION,
  EXTRA_MORE_LABEL,
  EXTRA_SAVE_LABEL,
]);

function displayQuestion(question: string): string {
  if (question === EXTRA_INPUT_PROMPT) return EXTRA_ANSWER_QUESTION;
  return question;
}

export function isHiddenQaContent(content: string): boolean {
  return HIDDEN_QA_CONTENTS.has(content.trim());
}

/** 저장 payload에서 메타 메시지 제거 (추가 본문·일반 Q&A는 유지) */
export function filterPersistMessages<T extends { role: string; content: string }>(
  messages: T[],
): T[] {
  return messages.filter((m) => !isHiddenQaContent(m.content));
}

export function parseQaPairs(messages: RecordMessage[]): QaPair[] {
  const sorted = [...messages].sort(
    (a, b) => (a.sortOrder ?? a.sort_order ?? 0) - (b.sortOrder ?? b.sort_order ?? 0),
  );
  const pairs: QaPair[] = [];
  let currentQ = '';

  for (const msg of sorted) {
    if (msg.role === 'bot') {
      // 메타 질문은 페어링 대상으로 두지 않음
      currentQ = isHiddenQaContent(msg.content) ? '' : msg.content;
    } else if (msg.role === 'user' && currentQ) {
      const answer = msg.content.trim() || '없음';
      if (!isHiddenQaContent(answer)) {
        pairs.push({
          question: displayQuestion(currentQ),
          answer,
        });
      }
      currentQ = '';
    } else if (msg.role === 'user' && isHiddenQaContent(msg.content.trim())) {
      // 고아 선택지 메시지는 무시
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
