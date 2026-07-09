import type { ExperienceCategoryId } from './categories';

export type QuestionSet = {
  q1: string;
  q2: string;
  q3: string;
  h1: string;
  h2: string;
  h3: string;
};

const negative: Record<ExperienceCategoryId, QuestionSet> = {
  job_prep: {
    q1: '오늘 취업 준비하면서 어떤 일이 있었나요?',
    h1: '(예: 자소서 항목에서 막힘, 정리 안 된 답변 등)',
    q2: '어떻게 해결하려고 했나요?',
    h2: '(예: 친구한테 피드백 받음, 다른 표현 시도함, 예시 찾아봄 등)',
    q3: '그 결과 어떤 변화가 있었나요?',
    h3: '(예: 다시 씀, 아직 막막함, 방향 다시 잡음 등)',
  },
  study: {
    q1: '오늘 공부하면서 어떤 일이 있었나요?',
    h1: '(예: 개념이 어려웠음, 진도 못 나감, 집중 안 됨 등)',
    q2: '막혔을 때 어떻게 해봤나요?',
    h2: '(예: 인강 다시 봄, 스터디원한테 물어봄, 방법 바꿔봄 등)',
    q3: '그 결과 어떤 변화가 있었나요?',
    h3: '(예: 이해함, 아직 못 풀었음, 다음으로 미룸 등)',
  },
  project: {
    q1: '오늘 어떤 일이 있었나요?',
    h1: '(예: 의견 충돌, 일정 지연, 역할 분담 문제 등)',
    q2: '막힌 부분을 어떻게 해결해보려고 했나요?',
    h2: '(예: 의견 다시 정리해서 말함, 양보함, 다른 방법 제안함 등)',
    q3: '그 다음 팀 반응이나 결과는 어땠나요?',
    h3: '(예: 합의됨, 여전히 애매함, 결국 각자 진행함 등)',
  },
  work: {
    q1: '오늘 근무하면서 어떤 일이 있었나요?',
    h1: '(예: 컴플레인, 바빴던 순간, 동료와의 마찰 등)',
    q2: '그때 어떻게 했나요?',
    h2: '(예: 먼저 사과함, 순서 정해서 처리함, 매니저한테 보고함 등)',
    q3: '그 결과 어떤 변화가 있었나요?',
    h3: '(예: 상황 진정됨, 아직 해결 안 됨, 다음에 또 반복될 것 같음 등)',
  },
  activity: {
    q1: '오늘 모임에서 어떤 일이 있었나요?',
    h1: '(예: 아쉬운 분위기, 역할 갑자기 바뀜, 의견 안 맞음 등)',
    q2: '그때 어떻게 했나요?',
    h2: '(예: 다른 역할 맡음, 의견 조율해봄, 그냥 넘김 등)',
    q3: '그 결과 어떤 변화가 있었나요?',
    h3: '(예: 잘 마무리됨, 여전히 애매함, 다음에 다시 얘기하기로 함 등)',
  },
  daily: {
    q1: '오늘 무슨 일이 있었나요?',
    h1: '(예: 일정 겹침, 예상 못한 상황, 갑작스러운 연락 등)',
    q2: '그때 어떻게 했나요?',
    h2: '(예: 우선순위 바로 정함, 양해 구함, 순서 다시 짬 등)',
    q3: '그 결과 어떤 변화가 있었나요?',
    h3: '(예: 잘 해결됨, 아직 정리 안 됨, 다음엔 미리 준비하기로 함 등)',
  },
};

const positive: Record<ExperienceCategoryId, QuestionSet> = {
  job_prep: {
    q1: '오늘 내용 중에 뭐가 마음에 드나요?',
    h1: '(예: 잘 풀어낸 경험, 미리 준비해둔 스토리, 계획대로 진행된 부분 등)',
    q2: '그걸 위해 어떤 걸 해봤나요?',
    h2: '(예: 개요부터 짬, 경험 다시 정리함, 여러 번 고쳐씀 등)',
    q3: '그 결과 어떤 변화가 있었나요?',
    h3: '(예: 자신감 생김, 방향이 명확해짐, 만족스러움 등)',
  },
  study: {
    q1: '오늘 공부하면서 뭐가 기억에 남았나요?',
    h1: '(예: 새로 이해한 개념, 방법 바꿔서 잘된 것, 목표한 만큼 해낸 것 등)',
    q2: '그걸 위해 시도해본 부분이 있나요?',
    h2: '(예: 방식 바꿔봄, 목표 미리 정함, 반복해서 풀어봄 등)',
    q3: '그 결과 어떤 변화가 있었나요?',
    h3: '(예: 이해도 올라감, 자신감 생김, 다음 계획 세움 등)',
  },
  project: {
    q1: '오늘 어떤 점이 잘 풀렸나요?',
    h1: '(예: 아이디어 채택됨, 역할 잘 맞음, 마감 맞춤 등)',
    q2: '그때 한 행동이 있나요?',
    h2: '(예: 데이터로 설득함, 먼저 일정 조율함, 팀원 도와줌 등)',
    q3: '그 다음 팀 반응이나 결과는 어땠나요?',
    h3: '(예: 다들 동의함, 진행 속도 빨라짐, 분위기 좋아짐 등)',
  },
  work: {
    q1: '오늘 근무하면서 어떤 점이 좋았나요?',
    h1: '(예: 잘 넘긴 순간, 칭찬받은 일, 뿌듯했던 순간 등)',
    q2: '그때 어떻게 했나요?',
    h2: '(예: 먼저 나서서 처리함, 손님/동료에게 설명함, 미리 준비해둠 등)',
    q3: '그 다음 반응이나 결과는 어땠나요?',
    h3: '(예: 고맙다는 말 들음, 매니저가 알아줌, 스스로 뿌듯함 등)',
  },
  activity: {
    q1: '오늘 모임에서 어떤 점이 좋았나요?',
    h1: '(예: 내가 낸 아이디어, 새로 맡은 역할, 잘 맞춘 협업 등)',
    q2: '그때 어떻게 했나요?',
    h2: '(예: 먼저 제안함, 역할 자원함, 다른 의견 수용함 등)',
    q3: '그 다음 반응이나 결과는 어땠나요?',
    h3: '(예: 다들 좋아함, 채택됨, 분위기 좋아짐 등)',
  },
  daily: {
    q1: '오늘 시간이나 상황 관리하면서 어떤 점이 좋았나요?',
    h1: '(예: 계획대로 진행됨, 갑작스러운 일 잘 넘김, 여유 있게 마무리함 등)',
    q2: '그걸 위해 해본 행동이 있나요?',
    h2: '(예: 전날 리스트 만듦, 순서 미리 정함, 즉석에서 대처함 등)',
    q3: '그 결과 어떤 변화가 있었나요?',
    h3: '(예: 시간 안에 끝냄, 여유 생김, 다음에도 이렇게 하기로 함 등)',
  },
};

/** 감정 1~3: 나빴음, 4~5: 좋았음 */
export function getQuestionSet(
  category: ExperienceCategoryId,
  emotionLevel: number,
): QuestionSet {
  return emotionLevel <= 3 ? negative[category] : positive[category];
}

export function getQuestions(category: ExperienceCategoryId, emotionLevel: number): string[] {
  const set = getQuestionSet(category, emotionLevel);
  return [set.q1, set.q2, set.q3];
}

export function getQuestionHints(category: ExperienceCategoryId, emotionLevel: number): string[] {
  const set = getQuestionSet(category, emotionLevel);
  return [set.h1, set.h2, set.h3];
}

export const EXTRA_QUESTION = '혹시 더 남기고 싶은 이야기가 있나요?';
export const EXTRA_QUESTION_HINT = '사소한 생각이나 감정이어도 괜찮아요.';

export const EMPTY_SAVE_MESSAGE = '오늘은 글로 남기지 않고 저장할까요?';
export const EMPTY_SAVE_SUBMESSAGE = '쉬어간 날도 기록이에요.';
