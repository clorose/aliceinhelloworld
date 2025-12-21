# Compact Summary - Alice in HelloWorld

> **Last Updated:** 2026-01-01

---

## 최근 완료된 작업 (2026-01-01)

### CategorySidebar 통합 및 SPA 구조

**변경된 파일:**
- `components/blog/CategorySidebar.tsx` - 공유 사이드바 컴포넌트
- `components/blog/BlogHome.tsx` - 메인 페이지
- `app/post/[...id]/page.tsx` - 포스트 상세 페이지

**삭제된 파일:**
- `components/post/PostSidebar.tsx`
- `app/category/[...path]/page.tsx`

**동작 방식:**

| 페이지 | 사이드바 표시 | 카테고리 클릭 시 |
|--------|-------------|-----------------|
| 메인 `/` | 최상위 + 자식 1단 (AI/LLM, AI/IMG...) | 해당 카테고리 포스트 목록 필터링 |
| 상세 `/post/*` | 현재 최상위의 자식들 + 1단 (상단에 AI 표시) | 글 사라지고 목록 표시 (SPA) |

**펼침 로직:**
- **카테고리 클릭** → 임시 펼침 (`focusedFolder`) - 다른 카테고리 클릭 시 닫힘
- **Chevron(▶) 클릭** → 영구 펼침 (`expandedFolders`) - 직접 닫을 때까지 유지

**PostPage ViewMode:**
```typescript
viewMode: 'post' | 'list'
// 'post' - PostReader로 글 표시
// 'list' - 카테고리 포스트 목록 표시
```

---

## 핵심 아키텍처

### MDX Dual-Pipeline (중요!)

```
Pipeline 1: 메타데이터 (서버)
lib/posts.ts → gray-matter + zod → BlogPost[]

Pipeline 2: 컴포넌트 렌더링 (빌드타임)
scripts/generate-post-map.ts → lib/post-map.ts (자동생성, 수정금지!)
```

**규칙:**
- MDX 파일 추가/이동/이름변경 후 → `pnpm run generate:posts`
- `lib/post-map.ts` 직접 수정 금지

### 상태 관리

| Store | 파일 | 용도 |
|-------|------|------|
| Desktop | `lib/stores/desktop-store.ts` | Window 관리, LocalStorage 저장 |
| Theme | `lib/stores/theme-store.ts` | 다크모드, LocalStorage 저장 |
| Settings | `lib/stores/settings-store.ts` | 사용자 설정 |

### 주요 컴포넌트 위치

```
components/
├── blog/
│   ├── BlogHome.tsx        # 메인 페이지 (/)
│   ├── BlogMenuBar.tsx     # 상단 메뉴바
│   └── CategorySidebar.tsx # 공유 사이드바 ★
├── finder/
│   ├── PostReader.tsx      # MDX 렌더링
│   └── PostList.tsx        # Finder 앱용 (Desktop 모드)
├── desktop/
│   ├── Desktop.tsx         # 데스크톱 모드
│   ├── Window.tsx          # 드래그/리사이즈 윈도우
│   └── Dock.tsx            # 하단 Dock
├── terminal/
│   └── TerminalApp.tsx     # 터미널 앱
├── quick-search/
│   └── QuickSearch.tsx     # Cmd+K 검색 (dark mode 지원)
└── ui/                     # 공통 UI 컴포넌트

hooks/
└── useCopyToClipboard.ts   # 클립보드 복사 hook

lib/utils/
└── highlight.tsx           # 검색어 하이라이트 유틸
```

---

## 해야 할 일 (우선순위순)

### P1: 즉시 필요
- [ ] 접근성 개선 (ARIA, 스크린 리더)
- [ ] 성능 최적화 (이미지, 번들)
- [ ] 테스트 프레임워크 도입 (Jest + RTL)

### P2: 중요하지만 나중에
- [ ] 댓글 시스템 (Giscus)
- [ ] RSS 피드 생성
- [ ] SEO 최적화
- [ ] Google Analytics

### P3: Nice-to-have
- [ ] PWA
- [ ] 창 스냅/그룹화
- [ ] Notes 앱
- [ ] TRPG 주사위/캐릭터 시트

---

## 자주 발생하는 문제 & 해결

### 1. 포스트 안 보임
```bash
pnpm run generate:posts
```

### 2. 빌드 캐시 문제
```bash
rm -rf .next && pnpm run build
```

### 3. 포트 충돌
```bash
lsof -ti:3000 | xargs kill -9
```

### 4. Hydration 에러
- 서버/클라이언트 렌더링 차이 확인
- `mounted` 상태로 클라이언트 전용 코드 래핑
```typescript
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```

---

## 코딩 규칙

1. **컴포넌트**: CVA (class-variance-authority) 사용
2. **상태 관리**: Zustand
3. **애니메이션**: Framer Motion
4. **색상**: Tailwind 기본 색상 (커스텀 최소화)
5. **MDX**: Server Component에서 직접 import, Client에서는 POST_MAP 사용

---

## 환경

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS 4
- **Fonts**: Pretendard (variable), Hack (monospace)
- **Deploy**: Vercel

---

## 참고 문서

- `docs/plan.md` - 상세 개발 계획
- `docs/roadmap.md` - 장기 로드맵
- `docs/architecture.md` - 아키텍처 상세
- `docs/components.md` - 컴포넌트 API
- `docs/glossary.md` - 용어 사전
- `CLAUDE.md` - AI 컨텍스트 (프로젝트 전체 가이드)
