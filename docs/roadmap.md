# Alice in HelloWorld - 향후 개발 계획

> **Last Updated:** 2025-01-01

## 프로젝트 비전

**Alice in HelloWorld**를 단순한 블로그를 넘어 **인터랙티브 데스크톱 경험의 개인 지식 허브**로 발전시킨다.

---

## Phase 1: 안정화 및 기반 강화 ✅ 대부분 완료

### 1.1 디자인 시스템 구축 ✅
- [x] Tailwind 커스텀 설정 (디자인 토큰) - `tailwind.config.ts`, `lib/design-tokens.ts`
- [x] 공통 UI 컴포넌트 라이브러리 구축 - `components/ui/`
  - Button, Card, Input, Badge, Typography
  - TrafficLightButton (Window controls)
  - Dropdown, LoadingSpinner, ErrorBoundary
- [x] 기존 컴포넌트 점진적 마이그레이션
- [ ] 컴포넌트 카탈로그/문서 작성 (Storybook 등)

### 1.2 성능 최적화
- [ ] 이미지 최적화 (Next.js Image)
- [ ] MDX 번들 크기 분석 및 최적화
- [ ] 코드 스플리팅 개선
- [ ] Lighthouse 점수 90+ 달성

### 1.3 접근성 (a11y) 개선
- [x] 키보드 네비게이션 지원 (부분)
  - Finder 화살표 키 탐색, Enter 열기
  - Cmd+K (Quick Search), Ctrl+` (Terminal)
- [ ] Window 포커스 순환 (Tab)
- [ ] Mission Control 단축키 (F3, Cmd+Tab)
- [ ] Screen reader 지원
- [ ] ARIA 속성 추가
- [ ] 색상 대비 개선 (WCAG AA 준수)

### 1.4 상태 지속성 ✅
- [x] Window 상태 LocalStorage 저장 - `lib/stores/desktop-store.ts`
  - 위치, 크기, 열린 창 목록
- [x] 사용자 설정 저장 - `lib/stores/settings-store.ts`
  - 다크 모드, 언어, 폰트 크기, 애니메이션
- [x] 세션 복원 기능

---

## Phase 2: 기능 확장 ✅ 대부분 완료

### 2.1 Finder (블로그) 고도화 ✅
- [x] 고급 검색 기능 - `components/finder/PostList.tsx`
  - 전문 검색 (Full-text search)
  - 필터링 (태그 `#tag` 문법)
  - 검색어 하이라이팅 (노란색)
- [x] 북마크 시스템 - `components/bookmarks/BookmarksApp.tsx`
- [x] 읽음/안읽음 추적
- [x] 관련 포스트 추천 - `components/finder/PostReader.tsx`
- [ ] 독서 진행률 추적 (스크롤 퍼센트)
- [ ] 댓글 시스템 (Giscus 또는 Utterances)
- [ ] RSS 피드 생성

### 2.2 Terminal 앱 ✅
- [x] 가상 터미널 컴포넌트 - `components/terminal/TerminalApp.tsx`
  - 기본 명령어 (help, about, ls, cd, cat 등)
  - ASCII 아트 인트로
- [x] 블로그 네비게이션 명령어 - `lib/terminal/commands/`
  - `search <keyword>`
  - `open <post-id>`
  - `tags`
- [x] 테마 변경 명령어

### 2.3 Settings 앱 ✅
- [x] 테마 설정 (라이트/다크/자동) - `components/settings/SettingsApp.tsx`
- [x] 언어 설정 (한글/영어)
- [x] 폰트 크기 조절
- [x] 애니메이션 on/off
- [x] 윈도우 동작 커스터마이징
  - 기본 크기/위치

### 2.4 추가 앱
- [ ] **Notes 앱**: 간단한 메모장 (Markdown 지원)
- [x] **Calendar 앱**: 블로그 포스트 타임라인 - `components/calendar/CalendarApp.tsx`
- [x] **Resume 앱**: 자기소개/포트폴리오 - `components/resume/ResumeApp.tsx`
- [ ] **TRPG 도구**:
  - 주사위 굴리기
  - 캐릭터 시트
  - 시나리오 뷰어

---

## Phase 3: 고급 기능 (진행 중)

### 3.1 멀티윈도우 고도화
- [ ] 창 스냅 기능 (화면 분할)
- [ ] 창 그룹화/탭
- [ ] Picture-in-Picture 모드
- [ ] 창 간 드래그 앤 드롭

### 3.2 Dock 시스템 ✅
- [x] 하단 Dock UI 구현 - `components/desktop/Dock.tsx`
- [x] 즐겨찾기 앱 고정 - `lib/app-registry.tsx`
- [x] 마우스 오버 확대 애니메이션
- [ ] 최근 사용 앱 표시
- [ ] 휴지통 기능 (닫은 창 복원)

### 3.3 알림 센터
- [x] 시스템 알림 (Toast) - sonner 라이브러리
- [ ] 새 포스트 알림
- [ ] 알림 히스토리
- [ ] 알림 설정

### 3.4 Spotlight 검색 ✅
- [x] 전역 검색 (Cmd+K) - `components/spotlight/Spotlight.tsx`
- [x] 포스트, 태그 통합 검색
- [x] 퍼지 검색 (Fuse.js 활용)
- [ ] 앱, 설정 검색 추가
- [ ] 상세 미리보기 패널

---

## Phase 4: 소셜 & 분석

### 4.1 SNS 공유
- [ ] 포스트 공유 기능 (Twitter/X, Facebook)
- [ ] Open Graph 메타태그 최적화
- [ ] 카카오톡 공유

### 4.2 Analytics
- [ ] Google Analytics 4 연동
- [ ] 조회수 카운터
- [ ] 인기 포스트 추적
- [ ] 사용자 행동 분석

### 4.3 GitHub 연동
- [ ] GitHub 활동 위젯
- [ ] 프로필 표시

---

## Phase 5: 모바일 & PWA

### 5.1 모바일 최적화
- [ ] 터치 제스처 지원
- [ ] 모바일 전용 레이아웃
- [ ] 반응형 Window 크기
- [ ] 햄버거 메뉴

### 5.2 Progressive Web App
- [ ] Service Worker 구현
- [ ] 오프라인 모드
- [ ] 푸시 알림
- [ ] 홈 화면 추가

---

## Phase 6: TRPG 기능 확장

### 6.1 TRPG 시나리오 관리
- [ ] 시나리오 에디터
- [ ] 캐릭터 관리 시스템
- [ ] NPC 데이터베이스
- [ ] 맵/이미지 갤러리

### 6.2 세션 관리
- [ ] 세션 로그 기록
- [ ] 타이머/카운터
- [ ] BGM 플레이어
- [ ] 주사위 히스토리

---

## 우선순위 매트릭스

### P0 (완료됨) ✅
- ~~디자인 시스템 구축~~
- ~~상태 지속성~~
- ~~Finder 고급 검색~~
- ~~Terminal 앱~~
- ~~Settings 앱~~
- ~~Dock 시스템~~
- ~~Spotlight 검색~~

### P1 (다음 우선순위)
- 접근성 개선 (ARIA, 스크린 리더)
- 성능 최적화 (이미지, 번들)
- 댓글 시스템
- RSS 피드

### P2 (중요하지만 나중에)
- PWA
- 외부 연동 (Analytics, SNS)
- 알림 센터 고도화

### P3 (Nice-to-have)
- TRPG 고급 기능
- Notes 앱
- 창 스냅/그룹화

---

## 현재 진행률

| Phase | 완료율 | 상태 |
|-------|--------|------|
| Phase 1 | 80% | 성능/접근성 남음 |
| Phase 2 | 85% | 댓글/RSS 남음 |
| Phase 3 | 60% | 창 고도화 남음 |
| Phase 4 | 0% | 미시작 |
| Phase 5 | 0% | 미시작 |
| Phase 6 | 0% | 미시작 |

**전체 P0-P1 완료율: ~75%**

---

## 장기 비전 (3년)

**Alice in HelloWorld**는...

- 📚 **지식 허브**: 체계화된 지식 베이스
- 🎮 **TRPG 플랫폼**: 온라인 TRPG 세션을 위한 올인원 도구
- 🌐 **커뮤니티**: 블로그를 넘어 지식 공유 커뮤니티
- 🎨 **오픈소스**: 다른 개발자들이 사용할 수 있는 템플릿
- 📱 **크로스 플랫폼**: Web, Mobile, Desktop 모두 지원

**핵심 가치:**
- 🚀 혁신적 UX
- 🎯 전문성 (AI 연구 & TRPG)
- 🔧 실용성
- 🌟 아름다운 디자인

---

## 기술 부채 & 개선 사항

See [plan.md](plan.md#기술-부채) for detailed technical debt tracking.
