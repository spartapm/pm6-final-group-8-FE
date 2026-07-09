# 콩팟 (Kongpot) Web

Next.js 프론트엔드 — 모바일 퍼스트 (375px 고정, 데스크탑 중앙 정렬)

## 시작하기

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Supabase 미설정 시 **개발 모드**로 동작합니다 (로컬 세션 + mock API).

## 주요 경로

| 경로 | 화면 |
|------|------|
| `/` | 스플래시 |
| `/onboarding` | 온보딩 |
| `/login` | 로그인 |
| `/home` | 홈/캘린더 |
| `/record/*` | 기록 플로우 |
| `/report` | 역량 리포트 |
| `/my` | 마이페이지 |

## 환경변수

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=http://localhost:4000
```
