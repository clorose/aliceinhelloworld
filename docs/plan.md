# Development Plan - Alice in HelloWorld

> 📖 **용어 사전**: [glossary.md](./glossary.md)에서 프로젝트 용어 확인 (Finder vs Folder 등)

## 현재 상태 (2025년 12월)

### ✅ 완료된 작업

#### Design System (Phase 1.1)
- [x] Tailwind CSS 4 커스텀 설정
- [x] 디자인 토큰 정의 (spacing, shadows, traffic colors)
- [x] UI 컴포넌트 구축
  - Button (6 variants, 4 sizes)
  - Card (with sub-components)
  - TrafficLightButton (macOS-style)
- [x] CVA (class-variance-authority) 도입

#### Bug Fixes
- [x] Traffic light button 색상 수정
- [x] Window resize 기능 수정 (pointer events)
- [x] PostList 테이블 정렬 수정

#### Infrastructure
- [x] CLAUDE.md AI 컨텍스트 파일 생성
- [x] MDX dual-pipeline 시스템 구축
- [x] Next.js 16 + Turbopack 설정

---

## 🎯 다음 우선순위 (즉시 시작 가능)

### P0: 핵심 UX 개선

#### 1. Window 상태 지속성 (LocalStorage) ✅ 완료 (2025-12-26)
**목표**: 사용자가 설정한 Window 위치/크기를 저장하고 복원

**구현 범위**:
- [x] `lib/stores/desktop-store.ts`에 LocalStorage 연동
  - Window 위치 저장/복원
  - Window 크기 저장/복원
  - 열린 창 목록 저장/복원
- [x] 페이지 새로고침 시 이전 상태 복원
- [x] 설정 초기화 기능 추가 (`resetWindowStates()`)

**파일**: `lib/stores/desktop-store.ts`
**구현 상세**: Zustand persist middleware 사용, `windowStates` 저장

---

#### 2. 다크모드 설정 저장 ✅ 완료 (2025-12-26)
**목표**: 다크모드 선택을 LocalStorage에 저장

**구현 범위**:
- [x] MenuBar 다크모드 토글 상태 저장
- [x] 페이지 로드 시 저장된 테마 적용
- [x] System preference 옵션 추가 (auto)

**파일**:
- `lib/stores/theme-store.ts` (신규)
- `components/desktop/MenuBar.tsx`

**구현 상세**: `'light' | 'dark' | 'system'` 테마 지원, OS 다크모드 자동 감지

---

#### 3. Finder 검색 개선 ✅ 완료 (2025-12-26)
**목표**: 현재는 slug와 tags만 검색 가능 → 제목, 내용도 검색 가능하게

**구현 범위**:
- [x] PostList 검색 로직 확장
  - frontmatter.title 검색
  - frontmatter.description 검색
  - `#태그` 문법으로 태그 필터링
- [x] 검색 결과 하이라이팅 (파일명, 태그)
- [x] 검색 시 폴더 자동 펼치기

**파일**: `components/finder/PostList.tsx`

**구현 상세**:
- `#ComfyUI` 문법으로 태그 필터
- 검색어 노란색 하이라이팅
- 매칭된 파일 있는 폴더 자동 expand

---

#### 4. Spotlight 검색 (Cmd+K) ✅ 완료 (2025-12-26)
**목표**: macOS-style 전역 검색 기능 구현

**구현 범위**:
- [x] Cmd+K (Mac) / Ctrl+K (Windows) 단축키로 Spotlight 열기
- [x] 전체 포스트 검색 (제목, 설명, 슬러그, 태그, 카테고리)
- [x] `#태그` 문법으로 태그 필터링
- [x] 검색 결과 하이라이팅
- [x] 키보드 네비게이션 (↑↓ 화살표, Enter로 선택, ESC로 닫기)
- [x] 검색 결과에서 포스트 직접 열기

**파일**:
- `components/spotlight/Spotlight.tsx` (신규)
- `components/desktop/Desktop.tsx` (수정)

**구현 상세**:
- Glassmorphism 스타일 오버레이
- 실시간 검색 필터링
- 최대 10개 결과 표시
- 검색어 없을 때 최신 포스트 8개 표시

---

#### 5. Desktop 아이콘 그리드 배치 ✅ 완료 (2025-12-26)
**목표**: Desktop 아이콘을 그리드 레이아웃으로 배치

**구현 범위**:
- [x] `flex flex-col flex-wrap`에서 `grid grid-cols-2`로 변경
- [x] 아이콘이 일렬로 길게 나열되지 않도록 개선

**파일**: `components/desktop/Desktop.tsx`

**구현 상세**: 2열 그리드 레이아웃, 4px 간격

---

#### 6. Resume/About 앱 ✅ 완료 (2025-12-26)
**목표**: 개인 프로필/포트폴리오 앱 구현

**구현 범위**:
- [x] ResumeApp 컴포넌트 생성
- [x] 프로필 정보 표시 (이름, 직함, 소개)
- [x] 소셜 링크 (GitHub, LinkedIn, Twitter, Website)
- [x] 스킬 섹션 (AI/ML, Frontend, Backend, Creative)
- [x] 경험 및 교육 섹션
- [x] Dock 및 Desktop에 아이콘 추가

**파일**:
- `components/resume/ResumeApp.tsx` (신규)
- `lib/app-registry.tsx` (수정)
- `components/desktop/Desktop.tsx` (수정)

**구현 상세**:
- User 아이콘 (indigo-600)
- 카테고리별 스킬 카드 (색상 구분)
- 반응형 레이아웃

---

### P1: 컴포넌트 완성도 (완료됨)

#### 7. 나머지 UI 컴포넌트 구축 ✅ 완료 (2025-12)
**목표**: 디자인 시스템 완성

**구현 범위**:
- [x] Input 컴포넌트
- [x] Badge 컴포넌트
- [x] Dropdown 컴포넌트
- [-] ContextMenu 컴포넌트 (불필요하여 삭제)
- [-] Tooltip 컴포넌트 (불필요하여 삭제)

**파일**: `components/ui/*`

---

#### 8. Dock 시스템 구현 ✅ 완료 (2025-12)
**목표**: macOS 스타일 하단 Dock 추가

**구현 범위**:
- [x] Dock UI 컴포넌트 생성
- [x] 앱 아이콘 호버 애니메이션 (확대) - Magnification 효과
- [x] 현재 실행 중인 앱 표시 (dot indicator)
- [x] 드래그로 아이콘 순서 변경
- [x] LocalStorage에 즐겨찾기 저장

**파일**:
- `components/desktop/Dock.tsx`
- `components/desktop/DockIcon.tsx`
- `lib/app-registry.tsx`
- `lib/utils/magnification.ts`

---

### P2: 새로운 앱 (완료됨)

#### 9. Terminal 앱 ✅ 완료 (2025-12)
**목표**: 인터랙티브 터미널 시뮬레이터

**구현 범위**:
- [x] Terminal UI 컴포넌트
- [x] 명령어 파서 및 실행기
- [x] 기본 명령어 구현
  - `help` - 도움말
  - `about` - 자기소개
  - `ls` - 포스트 목록
  - `cat <slug>` - 포스트 내용
  - `search <query>` - 포스트 검색
  - `clear` - 화면 지우기
  - `theme <light|dark>` - 테마 변경
- [x] 명령어 히스토리 (↑↓ 키)
- [x] Tab 자동완성
- [x] ASCII art intro (p10k-style prompt)

**파일**:
- `components/terminal/TerminalApp.tsx`
- `lib/terminal-commands.ts`

---

#### 10. Settings 앱 ✅ 완료 (2025-12)
**목표**: 사용자 설정 관리 앱

**구현 범위**:
- [x] Settings UI (사이드바 + 패널)
- [x] 테마 설정 (Light/Dark/Auto)
- [x] 폰트 크기 조절
- [x] 애니메이션 on/off
- [x] Window 기본 크기 설정
- [x] 언어 설정 (한글/영어)
- [x] 초기화 버튼

**파일**:
- `components/settings/SettingsApp.tsx`
- `lib/stores/settings-store.ts`

---

## 📅 2주 스프린트 계획

### Week 1: 상태 관리 & 검색
- Day 1-2: Window 상태 LocalStorage 저장/복원
- Day 3: 다크모드 설정 저장
- Day 4-5: Finder 검색 개선
- Day 6-7: 나머지 UI 컴포넌트 구축

### Week 2: Dock & Terminal
- Day 8-10: Dock 시스템 구현
- Day 11-14: Terminal 앱 구현

---

## 🔧 기술 부채

### ✅ 완료 (2025-12-26)
- [x] Console.log 디버그 코드 정리
- [x] TypeScript strict mode 활성화 (이미 활성화되어 있었음)
- [x] ESLint 규칙 강화
- [x] Window 랜덤 위치 화면 밖 방지 (50px 안전 마진)

### ✅ 완료 (2025-12-26)
- [x] **Dock magnification 리팩터링**
  - 변경 전: render 중 ref 접근 (ESLint 위반)
  - 변경 후: Framer Motion useMotionValue/useTransform 사용
  - 결과: ESLint 통과, 성능 유지
  - 참고: docs/answer.md Q1

### 즉시 해결 필요
(현재 없음)

### 단기 (1개월 내)
- [ ] 테스트 프레임워크 도입 (Jest + RTL)
- [ ] Ladle 설정 (Storybook 대신 - 가볍고 빠름)
- [ ] CI/CD 파이프라인 (GitHub Actions)

---

## 🎨 디자인 개선 아이디어

### UI/UX
- [ ] Window 드래그 시 snap grid (정렬 가이드)
- [ ] Window 간 드래그 앤 드롭
- [ ] Mission Control 개선 (썸네일 크기 조정)
- [ ] 로딩 스피너 개선
- [ ] Error boundary UI 개선

### 애니메이션
- [ ] Window 오픈 애니메이션 개선 (genie effect)
- [ ] Menu 드롭다운 애니메이션
- [ ] Page transition 애니메이션
- [ ] Dock 아이콘 bounce 효과

---

## 📊 성능 최적화 TODO

### 이미지
- [ ] Next.js Image 컴포넌트 적용
- [ ] WebP 포맷 전환
- [ ] Lazy loading

### 번들
- [ ] MDX 번들 크기 분석
- [ ] Tree shaking 개선
- [ ] Dynamic imports 확대

### 측정
- [ ] Lighthouse 점수 측정 (현재 기준선)
- [ ] Core Web Vitals 모니터링

---

## 🚀 배포 계획

### 즉시
- [x] Vercel 배포 완료
- [ ] Custom domain 연결
- [ ] SEO 메타태그 최적화

### 단기
- [ ] Google Search Console 등록
- [ ] Google Analytics 연동
- [ ] RSS 피드 생성

---

## 💡 아이디어 백로그

### 고려 중
- TRPG 주사위 굴리기 앱
- About/Portfolio 앱
- Notes 앱 (Markdown 메모장)
- Calendar 앱 (포스트 타임라인)
- Spotlight 검색 (Cmd+K)

### 장기
- PWA 전환
- 모바일 최적화
- 실시간 협업 기능

---

## 📝 Notes

### 디자인 철학
- **macOS 스타일 유지**: 일관된 macOS UX
- **최소 오버엔지니어링**: 필요한 것만 구현
- **성능 우선**: 번들 크기와 로딩 속도 항상 고려
- **접근성**: 키보드 네비게이션과 ARIA 속성 필수

### 코딩 원칙
- 컴포넌트는 항상 CVA 사용
- 색상은 Tailwind 기본 색상 사용 (커스텀 최소화)
- 상태 관리는 Zustand
- 애니메이션은 Framer Motion

---

## 🎯 이번 주 액션 아이템

**우선순위 1**: Window 상태 LocalStorage 저장
**우선순위 2**: 다크모드 설정 저장
**우선순위 3**: Finder 검색 개선

**목표**: 3개 완료 후 Dock 시스템 시작
