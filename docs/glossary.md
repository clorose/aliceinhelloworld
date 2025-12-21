# Glossary - 용어 사전

> 프로젝트에서 일관되게 사용하는 용어 정의. AI 협업 시 명확한 소통을 위해 작성됨.

---

## UI Components

### Desktop (데스크톱)
- **정의**: macOS 스타일의 바탕화면 전체 영역
- **컴포넌트**: `<Desktop>`
- **포함 요소**: MenuBar, AppIcon들, Window들, MissionControl
- **예시**: "Desktop에 AI Research 아이콘이 표시됨"
- **혼동 주의**: ~~바탕화면~~, ~~홈 화면~~ (x)

### Window (윈도우)
- **정의**: 데스크톱에서 띄울 수 있는 개별 창
- **컴포넌트**: `<Window>`
- **특징**: 드래그, 리사이즈, 최소화/최대화 가능
- **예시**: "Finder Window를 열었다", "Post Window가 2개 열려있다"
- **혼동 주의**: ~~팝업~~, ~~다이얼로그~~, ~~모달~~ (x)

**Window 구조:**
```
┌─────────────────────────────┐
│ Title Bar (타이틀 바)         │ ← 드래그 영역
│ ● ● ●  AI Research         │
├─────────────────────────────┤
│                             │
│  Content (콘텐츠 영역)       │
│                             │
└─────────────────────────────┘
```

### Title Bar (타이틀 바)
- **정의**: Window 상단의 제목 표시줄 (macOS 스타일)
- **위치**: Window 최상단 (높이 36px)
- **기능**:
  - Window 드래그 (이동)
  - Traffic Light Buttons 포함
  - Window 제목/아이콘 표시
- **예시**: "Title Bar를 잡고 드래그", "Title Bar에 아이콘이 표시됨"
- **혼동 주의**: ~~Header~~, ~~상단바~~ (비공식, 혼용 가능)

### MenuBar (메뉴바)
- **정의**: 화면 최상단의 메뉴 영역 (macOS 스타일)
- **컴포넌트**: `<MenuBar>`
- **포함 요소**: 로고, 시간, 다크모드 토글 등
- **예시**: "MenuBar에 다크모드 버튼 추가"

### AppIcon (앱 아이콘)
- **정의**: 데스크톱에 배치된 앱 실행 아이콘
- **컴포넌트**: `<AppIcon>`
- **예시**: "AI Research AppIcon을 더블클릭하면 Finder가 열림"
- **혼동 주의**: ~~Desktop Icon~~은 혼용 가능

---

## Finder (파일 탐색기)

### Finder (파인더)
- **정의**: macOS의 파일 탐색기 앱 전체
- **컴포넌트**: `<FinderApp>`
- **포함 요소**: Toolbar, Sidebar, PostList, PostReader
- **예시**: "Finder를 열어서 포스트를 선택"
- **혼동 주의**: Folder(폴더)와 구분 필요!

### Folder (폴더)
- **정의**: 파일 시스템의 디렉토리/폴더
- **타입**: `TreeNode` (type: 'folder')
- **예시**: "ai 폴더 안에 img 폴더가 있다"
- **혼동 주의**: Finder(앱)와 구분 필요!

### File (파일)
- **정의**: MDX 블로그 포스트 파일
- **타입**: `TreeNode` (type: 'file')
- **예시**: "post-1.mdx 파일을 더블클릭해서 열기"
- **혼동 주의**: Post(개념)와 혼용 가능

### PostList (포스트 리스트)
- **정의**: Finder 내부의 파일/폴더 트리 목록 영역
- **컴포넌트**: `<PostList>`
- **특징**: 폴더 펼침/접기, 키보드 네비게이션
- **예시**: "PostList에서 방향키로 이동"
- **혼동 주의**: ~~파일 목록~~, ~~트리뷰~~ (혼용 가능)

### PostReader (포스트 리더)
- **정의**: 개별 포스트를 읽는 뷰 (Window 내부 컨텐츠)
- **컴포넌트**: `<PostReader>`
- **예시**: "PostReader에 frontmatter가 렌더링됨"

### Sidebar (사이드바)
- **정의**: Finder 좌측의 폴더 네비게이션 영역
- **컴포넌트**: `<Sidebar>`
- **예시**: "Sidebar에서 AI 폴더 클릭"

---

## Content (콘텐츠)

### Post (포스트)
- **정의**: 블로그 게시글 (개념적)
- **타입**: `BlogPost`
- **속성**: id, slug, path, frontmatter
- **예시**: "이 Post의 제목은 'Introduction to CoC'다"
- **혼동 주의**: File(물리적)과 혼용 가능

### Frontmatter (프론트매터)
- **정의**: MDX 파일 상단의 메타데이터 (YAML)
- **타입**: `BlogPostFrontmatter`
- **포함 속성**: title, date, description, tags
- **예시**: "Frontmatter에 tags 추가"

### MDX
- **정의**: Markdown + JSX 파일 형식
- **확장자**: `.mdx`
- **예시**: "MDX 컴포넌트 렌더링"

---

## Tree Structure (트리 구조)

### Tree (트리)
- **정의**: 폴더/파일의 계층 구조
- **타입**: `TreeNode[]`
- **예시**: "buildPostTree()로 Tree 생성"

### TreeNode (트리 노드)
- **정의**: 트리의 개별 항목 (폴더 또는 파일)
- **타입**: `TreeNode`
- **속성**: type ('folder' | 'file'), name, fullPath, children?, post?
- **예시**: "TreeNode를 클릭하면 선택됨"

### Path (경로)
- **정의**: 파일/폴더의 경로 (배열 형태)
- **타입**: `string[]`
- **예시**: `['ai', 'img', 'comfyui']`
- **혼동 주의**: fullPath (문자열)와 구분

### fullPath (전체 경로)
- **정의**: 파일/폴더의 전체 경로 (문자열 형태)
- **타입**: `string`
- **예시**: `'ai/img/comfyui/nodes'`

---

## State Management (상태 관리)

### selectedPostId
- **정의**: 현재 선택된 포스트의 ID (FinderApp 레벨)
- **예시**: `'ai/img/comfyui/nodes/post-1'`

### selectedNodePath
- **정의**: 현재 포커스된 노드의 경로 (PostList 레벨, 폴더/파일 모두 가능)
- **예시**: `'ai/img/comfyui'` (폴더) 또는 `'ai/img/comfyui/nodes/post-1'` (파일)

### expandedFolders
- **정의**: 현재 펼쳐진 폴더들의 경로 Set
- **타입**: `Set<string>`
- **예시**: `Set(['ai/img', 'ai/llm'])`

---

## Actions (사용자 동작)

### Select (선택)
- **정의**: 클릭으로 항목을 선택 (파란색 하이라이트)
- **예시**: "post-1을 Select했다"
- **결과**: selectedPostId 또는 selectedNodePath 업데이트

### Open (열기)
- **정의**: 더블클릭 또는 Enter로 파일을 Window로 열기
- **예시**: "post-1을 Open했다"
- **결과**: 새 Window 생성

### Expand/Collapse (펼침/접기)
- **정의**: 폴더의 하위 항목을 보이기/숨기기
- **예시**: "ai 폴더를 Expand했다", "→ 키로 폴더 Expand"
- **결과**: expandedFolders 업데이트

### Focus (포커스)
- **정의**: 키보드 네비게이션의 현재 위치
- **예시**: "post-2에 Focus가 있다"
- **시각적**: 파란색 하이라이트
- **혼동 주의**: Select와 동일한 의미로 사용

---

## Common Mistakes (흔한 실수)

### ❌ 잘못된 용어
- "파인더 폴더" → ✅ "Finder에서 폴더"
- "포스트 리스트의 파인더" → ✅ "Finder의 PostList"
- "윈도우 팝업" → ✅ "Window"
- "파일 목록" → ✅ "PostList" (더 명확함)
- "트리 리스트" → ✅ "PostList" 또는 "Tree"

### ❌ 혼용 주의
- Finder ≠ Folder
- Window ≠ Dialog/Modal
- Select ≠ Open
- Path ≠ fullPath

---

## Usage in Code Comments

```typescript
// ✅ Good
"Finder를 열 때 rootPath 아래 폴더만 표시"
"폴더를 Expand하면 하위 파일이 보임"
"PostList에서 파일을 Select하면 selectedPostId 업데이트"

// ❌ Bad
"파인더 폴더를 열면..." (Finder와 Folder 혼용)
"파일 목록에서..." (PostList가 더 명확)
"팝업 창을..." (Window 사용)
```

---

## Quick Reference

| 한글 | 영문 | 컴포넌트/타입 |
|------|------|--------------|
| 데스크톱 | Desktop | `<Desktop>` |
| 윈도우/창 | Window | `<Window>` |
| 타이틀 바 | Title Bar | Window 내부 (div) |
| 파인더 | Finder | `<FinderApp>` |
| 폴더 | Folder | `TreeNode` (type: 'folder') |
| 파일 | File | `TreeNode` (type: 'file') |
| 포스트 | Post | `BlogPost` |
| 포스트 리스트 | PostList | `<PostList>` |
| 사이드바 | Sidebar | `<Sidebar>` |
| 메뉴바 | MenuBar | `<MenuBar>` |
| 앱 아이콘 | AppIcon | `<AppIcon>` |

---

## Notes

- 이 용어 사전은 **AI(Claude) 협업 시 명확한 소통**을 위해 작성됨
- 코드 리뷰, 이슈, PR, 주석에서 일관되게 사용
- 새로운 용어 추가 시 이 문서 업데이트 필수
