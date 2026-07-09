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
      { code: 'cause_analysis', name: '원인 분석력', category: 'problem_solving', definition: '현상 이면의 근본 원인을 파고드는 경험' },
      { code: 'alternative_design', name: '대안 설계력', category: 'problem_solving', definition: '여러 해결 방안을 비교·검토하는 경험' },
      { code: 'resource_utilization', name: '자원 활용력', category: 'problem_solving', definition: '제한된 자원(시간/예산/인력) 안에서 해결책을 찾는 경험' },
      { code: 'data_driven_judgment', name: '데이터 기반 판단력', category: 'problem_solving', definition: '수치/근거를 통해 결론을 도출하는 경험' },
      { code: 'crisis_response', name: '위기 대응력', category: 'problem_solving', definition: '예상치 못한 문제 발생 시 즉각 대응하는 경험' },
    ],
  },
  {
    category: 'communication',
    label: '커뮤니케이션',
    tags: [
      { code: 'persuasion', name: '설득력', category: 'communication', definition: '상대를 논리적으로 설득해 동의를 이끌어낸 경험' },
      { code: 'listening', name: '경청력', category: 'communication', definition: '상대의 니즈나 의견을 정확히 파악한 경험' },
      { code: 'conflict_mediation', name: '갈등조정력', category: 'communication', definition: '이해관계 충돌 상황을 중재한 경험' },
      { code: 'information_delivery', name: '정보전달력', category: 'communication', definition: '복잡한 내용을 쉽게 풀어 전달한 경험' },
      { code: 'collaborative_communication', name: '협업소통력', category: 'communication', definition: '팀 내 정보 공유와 피드백 교환 경험' },
    ],
  },
  {
    category: 'initiative',
    label: '주도성',
    tags: [
      { code: 'proactive_execution', name: '자발적 실행력', category: 'initiative', definition: '지시 없이 스스로 일을 찾아 진행한 경험' },
      { code: 'responsibility', name: '책임감', category: 'initiative', definition: '맡은 일의 결과까지 끝까지 책임진 경험' },
      { code: 'improvement_proposal', name: '개선제안력', category: 'initiative', definition: '기존 방식의 문제를 발견하고 바꾸자고 제안한 경험' },
      { code: 'goal_setting', name: '목표설정력', category: 'initiative', definition: '스스로 목표를 세우고 추진한 경험' },
      { code: 'risk_taking', name: '리스크 감수력', category: 'initiative', definition: '불확실성에도 먼저 나서서 시도한 경험' },
    ],
  },
  {
    category: 'flexibility',
    label: '유연성',
    tags: [
      { code: 'situational_adaptation', name: '상황적응력', category: 'flexibility', definition: '계획이 틀어졌을 때 빠르게 방향을 바꾼 경험' },
      { code: 'diversity_acceptance', name: '다양성 수용력', category: 'flexibility', definition: '다른 배경/의견을 가진 사람과 협업한 경험' },
      { code: 'role_switching', name: '역할전환력', category: 'flexibility', definition: '필요에 따라 다른 역할을 맡아 수행한 경험' },
      { code: 'learning_transfer', name: '학습전환력', category: 'flexibility', definition: '새로운 툴/환경에 빠르게 적응한 경험' },
      { code: 'feedback_acceptance', name: '피드백 수용력', category: 'flexibility', definition: '지적이나 비판을 받아들여 수정한 경험' },
    ],
  },
  {
    category: 'planning',
    label: '계획성',
    tags: [
      { code: 'schedule_management', name: '일정관리력', category: 'planning', definition: '마감일을 지키기 위해 일정을 조율한 경험' },
      { code: 'priority_setting', name: '우선순위설정력', category: 'planning', definition: '여러 업무 중 중요도를 판단해 순서를 정한 경험' },
      { code: 'systematic_execution', name: '체계적 실행력', category: 'planning', definition: '단계별로 계획을 세워 실행한 경험' },
      { code: 'resource_allocation', name: '리소스 배분력', category: 'planning', definition: '인력/시간/예산을 효율적으로 배치한 경험' },
      { code: 'risk_prediction', name: '사전 리스크 예측력', category: 'planning', definition: '발생 가능한 문제를 미리 예상하고 대비한 경험' },
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
