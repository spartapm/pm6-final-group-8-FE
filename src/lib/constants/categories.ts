import { figmaAssets } from '@/lib/figma-assets';

export const EXPERIENCE_CATEGORIES = [
  { id: 'work', label: '근무·아르바이트', icon: figmaAssets.catWork },
  { id: 'resume', label: '자소서·이력서', icon: figmaAssets.catResume },
  { id: 'interview', label: '면접·채용 준비', icon: figmaAssets.catInterview },
  { id: 'study', label: '학습·자격증', icon: figmaAssets.catStudy },
  { id: 'project', label: '프로젝트·과제', icon: figmaAssets.catProject },
  { id: 'activity', label: '대외활동·동아리', icon: figmaAssets.catActivity },
  { id: 'other', label: '기타', icon: figmaAssets.catOther },
] as const;

export type ExperienceCategoryId = (typeof EXPERIENCE_CATEGORIES)[number]['id'];

export const EMOTIONS = [
  { level: 1, label: '힘들어요', emoji: '😫' },
  { level: 2, label: '별로예요', emoji: '😕' },
  { level: 3, label: '그저 그래요', emoji: '😐' },
  { level: 4, label: '괜찮아요', emoji: '🙂' },
  { level: 5, label: '좋아요', emoji: '😊' },
] as const;

export function getEmotionLabel(level: number) {
  return EMOTIONS.find((e) => e.level === level)?.label ?? '';
}

export function getEmotionEmoji(level: number) {
  return EMOTIONS.find((e) => e.level === level)?.emoji ?? '😐';
}

export const EMOTION_IMAGES = [
  figmaAssets.emotion1,
  figmaAssets.emotion2,
  figmaAssets.emotion3,
  figmaAssets.emotion4,
  figmaAssets.emotion5,
] as const;

export function getEmotionImage(level: number) {
  const index = Math.min(5, Math.max(1, level)) - 1;
  return EMOTION_IMAGES[index];
}

/** 1–2 나쁨, 3 중립, 4–5 좋음 */
export type EmotionBucket = 'negative' | 'neutral' | 'positive';

export function getEmotionBucket(level: number): EmotionBucket {
  if (level <= 2) return 'negative';
  if (level === 3) return 'neutral';
  return 'positive';
}

export function isNegativeEmotion(level: number) {
  return level <= 2;
}

export const CATEGORY_LABELS: Record<string, string> = {
  ...Object.fromEntries(EXPERIENCE_CATEGORIES.map((c) => [c.id, c.label])),
  // legacy ids (마이그레이션 전 기록 표시용)
  job_prep: '자소서·이력서',
  daily: '기타',
};

export const COMPETENCY_CATEGORIES = [
  { id: 'problem_solving', label: '문제해결' },
  { id: 'communication', label: '커뮤니케이션' },
  { id: 'initiative', label: '주도성' },
  { id: 'flexibility', label: '유연성' },
  { id: 'planning', label: '계획성' },
] as const;

export type CompetencyCategoryId = (typeof COMPETENCY_CATEGORIES)[number]['id'];
