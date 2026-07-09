import { figmaAssets } from '@/lib/figma-assets';

export const EXPERIENCE_CATEGORIES = [
  { id: 'job_prep', label: '취업 준비', icon: figmaAssets.catJob },
  { id: 'study', label: '자격증/직무 학습', icon: figmaAssets.catStudy },
  { id: 'project', label: '프로젝트/과제', icon: figmaAssets.catProject },
  { id: 'work', label: '아르바이트/근무', icon: figmaAssets.catWork },
  { id: 'activity', label: '대외활동/동아리', icon: figmaAssets.catActivity },
  { id: 'daily', label: '일상 속 경험', icon: figmaAssets.catDaily },
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

export function isNegativeEmotion(level: number) {
  return level <= 3;
}

export const CATEGORY_LABELS: Record<string, string> = Object.fromEntries(
  EXPERIENCE_CATEGORIES.map((c) => [c.id, c.label]),
);

export const COMPETENCY_CATEGORIES = [
  { id: 'problem_solving', label: '문제해결' },
  { id: 'communication', label: '커뮤니케이션' },
  { id: 'initiative', label: '주도성' },
  { id: 'flexibility', label: '유연성' },
  { id: 'planning', label: '계획성' },
] as const;

export type CompetencyCategoryId = (typeof COMPETENCY_CATEGORIES)[number]['id'];
