import type { CompetencyCategoryId } from './categories';

export interface CompetencyTagDefinition {
  code: string;
  name: string;
  category: CompetencyCategoryId;
  definition: string;
}

export const COMPETENCY_TAG_GROUPS: Array<{
  category: CompetencyCategoryId;
  label: string;
  tags: CompetencyTagDefinition[];
}> = [
  {
    category: 'problem_solving',
    label: '문제해결',
    tags: [
      { code: 'problem_definition', name: '문제 인식·정의', category: 'problem_solving', definition: '상황에서 진짜 문제가 뭔지 짚어내는 경험' },
      { code: 'cause_analysis', name: '원인 분석', category: 'problem_solving', definition: '근본 원인을 논리적으로 파고드는 경험' },
      { code: 'alternative_decision', name: '대안 도출·의사결정', category: 'problem_solving', definition: '여러 해결책을 놓고 최선을 고르는 경험' },
      { code: 'crisis_response', name: '위기 대응·수습', category: 'problem_solving', definition: '예상 못 한 문제가 터졌을 때 즉각 대응하고 수습한 경험' },
      { code: 'result_validation', name: '결과 검증', category: 'problem_solving', definition: '해결책이 실제로 먹혔는지 확인한 경험' },
    ],
  },
  {
    category: 'communication',
    label: '커뮤니케이션',
    tags: [
      { code: 'listening_understanding', name: '경청·이해', category: 'communication', definition: '상대 말의 니즈·의도를 정확히 파악한 경험' },
      { code: 'expression', name: '의사표현', category: 'communication', definition: '목적에 맞게 아이디어를 효과적으로 전달한 경험' },
      { code: 'persuasion_alignment', name: '설득·조율', category: 'communication', definition: '논리로 동의를 이끌거나 이해관계를 조율한 경험' },
      { code: 'conflict_mediation', name: '갈등 중재', category: 'communication', definition: '충돌 상황에서 제3자로서 중간에 개입해 푼 경험' },
      { code: 'collaborative_communication', name: '협업소통', category: 'communication', definition: '팀 내 정보 공유·피드백 교환 경험' },
    ],
  },
  {
    category: 'initiative',
    label: '주도성',
    tags: [
      { code: 'self_driven_execution', name: '자기주도적 실행', category: 'initiative', definition: '시키지 않아도 스스로 일을 찾아 시작한 경험' },
      { code: 'goal_setting', name: '목표 설정', category: 'initiative', definition: '스스로 기준을 세우고 방향을 정한 경험' },
      { code: 'improvement_proposal', name: '개선 제안', category: 'initiative', definition: '기존 방식의 문제를 발견하고 바꾸자고 제안한 경험' },
      { code: 'ownership', name: '책임감·오너십', category: 'initiative', definition: '결과까지 자기 것으로 받아들이고 끝까지 책임진 경험 (자기 성찰 포함)' },
      { code: 'risk_taking', name: '도전·리스크 감수', category: 'initiative', definition: '불확실해도 먼저 나서서 시도한 경험' },
    ],
  },
  {
    category: 'flexibility',
    label: '유연성',
    tags: [
      { code: 'situational_adaptation', name: '상황 적응', category: 'flexibility', definition: '계획이 틀어졌을 때 방향을 바꾼 경험' },
      { code: 'priority_rebalancing', name: '우선순위 재조정', category: 'flexibility', definition: '변수로 인해 우선순위를 다시 짠 경험' },
      { code: 'diversity_acceptance', name: '다양성 수용', category: 'flexibility', definition: '다른 배경·의견을 가진 사람과 협업한 경험' },
      { code: 'learning_agility', name: '학습 민첩성', category: 'flexibility', definition: '새로운 도구·환경에 빠르게 적응한 경험' },
      { code: 'feedback_acceptance', name: '피드백 수용', category: 'flexibility', definition: '지적이나 비판을 받아들여 수정한 경험' },
    ],
  },
  {
    category: 'planning',
    label: '계획성',
    tags: [
      { code: 'goal_time_planning', name: '목표·시간 계획', category: 'planning', definition: '마감을 고려해 시간을 배분한 경험' },
      { code: 'priority_setting', name: '우선순위 설정', category: 'planning', definition: '여러 과제 중 중요도를 판단해 순서를 정한 경험' },
      { code: 'resource_allocation', name: '자원 배분', category: 'planning', definition: '인력·예산·도구를 효율적으로 배치한 경험' },
      { code: 'progress_management', name: '진행 관리', category: 'planning', definition: '계획대로 되는지 점검하고 조정한 경험' },
      { code: 'risk_prediction', name: '사전 리스크 예측', category: 'planning', definition: '발생 가능한 문제를 미리 예상하고 대비한 경험' },
    ],
  },
];

export const COMPETENCY_TAGS = COMPETENCY_TAG_GROUPS.flatMap((group) => group.tags);

export const COMPETENCY_TAG_BY_CODE = Object.fromEntries(
  COMPETENCY_TAGS.map((tag) => [tag.code, tag]),
);

export function getCompetencyTagName(code: string): string {
  return COMPETENCY_TAG_BY_CODE[code]?.name ?? code;
}

export function getCompetencyTagDefinition(code: string): string {
  return COMPETENCY_TAG_BY_CODE[code]?.definition ?? '';
}
