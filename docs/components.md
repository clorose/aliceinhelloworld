# Component Guide - Alice in HelloWorld

> **용어 사전**: [glossary.md](./glossary.md)에서 컴포넌트 용어 확인

---

## Desktop Components

### Desktop (`components/desktop/Desktop.tsx`)

메인 데스크톱 컨테이너. 모든 Window와 AppIcon을 관리.

**Props**: 없음 (전역 상태 사용)

**Features**:
- Zustand store에서 windows 배열 읽기
- Window 렌더링 (z-index 순서대로)
- AppIcon 배치
- MissionControl 관리

**Example**:
```tsx
export default function HomePage() {
  return <Desktop />;
}
```

---

### Window (`components/desktop/Window.tsx`)

드래그/리사이즈 가능한 개별 창.

**Props**:
```typescript
interface WindowProps {
  id: WindowId;
  title: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  onClose?: () => void;
}
```

**Features**:
- framer-motion drag & dragControls
- Resize handle (bottom-right corner)
- Traffic light buttons (close, minimize, maximize)
- z-index auto-increment on focus
- Position/size persistence (future: LocalStorage)

**Usage**:
```typescript
openWindow({
  id: "post-ai-intro",
  title: "Introduction to AI",
  icon: <Bot className="w-8 h-8" />,
  content: <PostReader post={post} />,
});
```

---

### MenuBar (`components/desktop/MenuBar.tsx`)

화면 최상단 메뉴바 (macOS 스타일).

**Features**:
- Logo (좌측)
- Clock (우측)
- Dark mode toggle (우측)
- System info (future)

**Future**:
- Menu dropdowns (File, Edit, View, etc.)
- Spotlight search (Cmd+K)

---

### AppIcon (`components/desktop/AppIcon.tsx`)

데스크톱에 배치된 앱 아이콘.

**Props**:
```typescript
interface AppIconProps {
  title: string;
  icon: React.ReactNode;
  onDoubleClick: () => void;
  position?: { x: number; y: number };
}
```

**Features**:
- Double-click to open app
- Grid snap (future)
- Draggable position (future)

**Example**:
```tsx
<AppIcon
  title="AI Research"
  icon={<Bot className="w-16 h-16" />}
  onDoubleClick={() => openFinder(["ai"])}
/>
```

---

### MissionControl (`components/desktop/MissionControl.tsx`)

모든 열린 Window 썸네일 뷰 (Cmd+` 토글).

**Features**:
- Window 썸네일 그리드
- 클릭으로 Window 활성화
- ESC로 닫기

**Future**:
- Window 크기 조정
- Drag to reorder

---

## Finder Components

### FinderApp (`components/finder/FinderApp.tsx`)

파일 탐색기 메인 컨테이너.

**Props**:
```typescript
interface FinderAppProps {
  posts: BlogPost[];
  initialPath?: string[];      // 초기 폴더 경로
  rootPath?: string[];          // 표시할 루트 경로 (필터링)
  onOpenPost?: (post: BlogPost) => void;
}
```

**Features**:
- Toolbar (뒤로가기, 앞으로가기, 경로 breadcrumb)
- Sidebar (폴더 네비게이션)
- PostList (파일/폴더 트리)
- PostReader (선택된 포스트 미리보기)

**rootPath 동작**:
```typescript
// Desktop.tsx
<FinderApp
  posts={posts}
  initialPath={["ai"]}
  rootPath={["ai"]}  // "ai" 폴더 아래만 표시
/>
```

---

### PostList (`components/finder/PostList.tsx`)

파일/폴더 트리 목록 (Table 레이아웃).

**Props**:
```typescript
interface PostListProps {
  posts: BlogPost[];
  onSelect: (post: BlogPost) => void;    // 클릭 (파란색 하이라이트)
  onOpen: (post: BlogPost) => void;      // 더블클릭 (Window 열기)
  selectedPostId: string | null;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}
```

**Features**:
- 폴더/파일 트리 렌더링
- 검색 필터 (slug, tags)
- 키보드 네비게이션 (↑↓ 이동, → 펼치기, ← 접기, Enter 열기)
- 폴더 펼침/접기 상태 관리
- Click/double-click 구분 (200ms timeout)

**State**:
- `expandedFolders: Set<string>` - 펼쳐진 폴더 경로
- `selectedNodePath: string | null` - 키보드 포커스 (파일 + 폴더)

**Keyboard Navigation**:
- `ArrowUp/Down`: 항목 이동
- `ArrowRight`: 폴더 펼치기
- `ArrowLeft`: 폴더 접기
- `Enter`: 파일 열기 / 폴더 토글
- `Space`: 항목 선택

---

### PostReader (`components/finder/PostReader.tsx`)

개별 포스트 뷰어 (MDX 렌더링).

**Props**:
```typescript
interface PostReaderProps {
  post: BlogPost;
  onTagClick?: (tag: string) => void;
}
```

**Features**:
- Frontmatter 표시 (title, date, description, tags)
- MDX content lazy-loading (POST_MAP 사용)
- Tag 클릭 → 검색 필터 적용 (future)

**MDX Loading**:
```typescript
const MDXContent = POST_MAP[post.id];
if (!MDXContent) return <ErrorBoundary />;

return (
  <Suspense fallback={<LoadingSpinner />}>
    <MDXContent />
  </Suspense>
);
```

---

### Sidebar (`components/finder/Sidebar.tsx`)

Finder 좌측 폴더 네비게이션.

**Props**:
```typescript
interface SidebarProps {
  folders: string[];              // 폴더 목록
  currentPath: string[];
  onNavigate: (path: string[]) => void;
}
```

**Features**:
- 폴더 클릭 → currentPath 변경
- 현재 폴더 하이라이트

---

## UI Components

### Button (`components/ui/Button.tsx`)

범용 버튼 컴포넌트 (CVA 기반).

**Variants**:
- `default`: 기본 스타일
- `primary`: 파란색 배경
- `secondary`: 회색 배경
- `ghost`: 투명 배경
- `danger`: 빨간색 배경
- `outline`: 테두리만

**Sizes**: `xs`, `sm`, `md`, `lg`

**Example**:
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>
```

---

### Card (`components/ui/Card.tsx`)

카드 레이아웃 컴포넌트.

**Sub-components**:
- `<Card>`: 메인 컨테이너
- `<CardHeader>`: 헤더 영역
- `<CardTitle>`: 제목
- `<CardDescription>`: 설명
- `<CardContent>`: 본문
- `<CardFooter>`: 푸터

**Example**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Post Title</CardTitle>
    <CardDescription>Brief summary</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Main content here</p>
  </CardContent>
</Card>
```

---

### TrafficLightButton (`components/ui/TrafficLightButton.tsx`)

macOS 스타일 창 컨트롤 버튼.

**Props**:
```typescript
interface TrafficLightButtonProps {
  variant: "close" | "minimize" | "maximize";
  onClick?: () => void;
  isMaximized?: boolean;  // maximize 버튼만 사용
}
```

**Colors**:
- `close`: 빨간색 (#FF5F57)
- `minimize`: 노란색 (#FFBD2E)
- `maximize`: 초록색 (#28CA42)

**Hover**: 아이콘 표시 (×, −, +)

---

### LoadingSpinner (`components/ui/LoadingSpinner.tsx`)

로딩 스피너 컴포넌트.

**Sizes**: `sm`, `md`, `lg`

**Example**:
```tsx
<LoadingSpinner size="md" />
```

---

### ErrorBoundary (`components/ui/ErrorBoundary.tsx`)

에러 경계 컴포넌트 (React Error Boundary).

**Features**:
- 에러 캐치 및 fallback UI 표시
- 에러 로그 출력
- Retry 버튼

**Usage**:
```tsx
<ErrorBoundary>
  <SuspenseComponent />
</ErrorBoundary>
```

---

## MDX Components (`components/mdx-components.tsx`)

MDX 파일에서 사용 가능한 커스텀 컴포넌트.

**Exported Components**:
- `<h1>`, `<h2>`, `<h3>`: 헤딩 (anchor 링크 추가)
- `<p>`: 단락
- `<a>`: 링크 (외부 링크는 `target="_blank"`)
- `<ul>`, `<ol>`, `<li>`: 리스트
- `<code>`: 인라인 코드
- `<pre>`: 코드 블록 (Syntax Highlighting)
- `<blockquote>`: 인용구
- `<img>`: 이미지 (Next.js Image 전환 예정)

**Example Usage in MDX**:
```mdx
---
title: "My Post"
---

## Introduction

This is a **bold** text with [link](https://example.com).

```typescript
const foo = "bar";
```

> This is a quote.
```

---

## Accessibility

### Keyboard Navigation
- PostList: ↑↓←→ navigation
- Window: Tab focus management
- MissionControl: ESC to close

### ARIA Attributes
- `role="grid"` on PostList table
- `aria-selected` on selected rows
- `aria-label` on buttons and inputs

### Focus Management
- Visible focus indicators (blue outline)
- Focus trap in modals (future)
- Skip to content link (future)
