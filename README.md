# Alice in HelloWorld

OS 인터페이스를 차용한 개인 블로그 겸 TRPG 툴킷.

## 개요

macOS/Windows 스타일의 데스크탑 환경에서 여러 앱을 실행하는 형태로 구현.  
블로그, 터미널, 설정 등의 앱과 TRPG용 가짜 웹사이트를 포함.

## 주요 기능

### 블로그
- **AI**: LLM, 프롬프트 엔지니어링, 이미지 생성 관련
- **TRPG**: 시나리오, 캐릭터 시트, 룰북 정리
- **Dev**: 프론트엔드 개발, 프레임워크, 코드 패턴

각 블로그는 독립된 앱으로 실행되며 OS UI 내에서 창 형태로 표시됨.

### TRPG 가짜 사이트
시대별/테마별 웹사이트를 재현한 인터랙티브 사이트.  
90년대 BBS, 2000년대 포털, 탐정사무소 등을 구현 예정.

플레이어가 사이트 간 데이터를 공유하며 퍼즐을 풀거나 단서를 수집하는 용도.

### OS UI
- 상단 메뉴바
===
- 드래그 가능한 창
- 최소화/최대화/닫기
- 다크모드 지원

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4 + SCSS
- **UI Components**: Radix UI
- **State**: Zustand
- **Animation**: Framer Motion
- **Content**: MDX
- **Data Fetching**: TanStack Query

## 폴더 구조
<details>
<summary>📸 구조도 이미지</summary>

![folder](./folder.png)

</details>

<details>
<summary>📁 상세 트리 구조</summary>

```zsh
📦 aliceinhelloworld/
├── 📂 app/
│   ├── 📘 layout.tsx              # ROOT (전역 CSS, Providers)
│   ├── 🎨 globals.css             # Tailwind imports
│   │
│   ├── 📂 (os)/                   # OS UI
│   │   ├── 📘 layout.tsx          # 상단바, 독, 배경
│   │   └── 📘 page.tsx            # 데스크탑 화면
│   │
│   ├── 📂 apps/                   # OS 앱들
│   │   ├── 📂 blog/
│   │   │   ├── 📘 page.tsx                    # 블로그 메인
│   │   │   ├── 📂 post/
│   │   │   │   └── 📂 [slug]/
│   │   │   │       └── 📘 page.tsx            # 포스트
│   │   │   └── 📂 category/
│   │   │       └── 📂 [category]/
│   │   │           └── 📘 page.tsx            # 카테고리
│   │   ├── 📂 terminal/
│   │   │   └── 📘 page.tsx
│   │   └── 📂 settings/
│   │       └── 📘 page.tsx
│   │
│   └── 📂 sites/                  # TRPG 가짜 사이트
│       └── 📂 [siteId]/
│           ├── 📘 layout.tsx      # 사이트별 레이아웃
│           ├── 📘 page.tsx        # 사이트 페이지
│           └── 🎨 page.module.scss
│
├── 📂 content/                    # MDX 콘텐츠
│   └── 📂 blog/
│       ├── 📂 ai/
│       │   ├── 📝 intro-to-llm.mdx
│       │   └── 📝 prompt-engineering.mdx
│       ├── 📂 trpg/
│       │   ├── 📝 coc-scenario.mdx
│       │   └── 📝 character-sheet.mdx
│       └── 📂 dev/
│           ├── 📝 next-app-router.mdx
│           └── 📝 react-patterns.mdx
│
├── 📂 components/
│   ├── 📂 os/                     # OS UI 컴포넌트
│   │   ├── ⚛️ Window.tsx
│   │   ├── ⚛️ Dock.tsx
│   │   ├── ⚛️ MenuBar.tsx
│   │   ├── ⚛️ Desktop.tsx
│   │   └── ⚛️ AppIcon.tsx
│   ├── 📂 ui/                     # Radix UI 래핑
│   │   ├── ⚛️ dialog.tsx
│   │   ├── ⚛️ popover.tsx
│   │   └── ⚛️ context-menu.tsx
│   ├── 📂 mdx/                    # MDX 컴포넌트
│   │   ├── ⚛️ CodeBlock.tsx
│   │   └── ⚛️ Callout.tsx
│   └── ⚛️ Providers.tsx           # Theme, Query 등
│
├── 📂 lib/
│   ├── 📂 mdx/                    # MDX 유틸
│   │   ├── 📄 getMDXFiles.ts
│   │   ├── 📄 parseMDX.ts
│   │   └── 📄 rehype-plugins.ts
│   ├── 📂 stores/                 # Zustand
│   │   ├── 📄 useOSStore.ts
│   │   └── 📄 useGameStore.ts
│   └── 📂 utils/
│       ├── 📄 cn.ts
│       └── 📄 date.ts
│
├── 📂 styles/
│   └── 📂 fake-sites/
│       ├── 🎨 _variables.scss
│       ├── 🎨 _mixins.scss
│       └── 📂 themes/             # 사이트별 테마
│           ├── 🎨 bbs-1990s.scss
│           ├── 🎨 portal-2000s.scss
│           └── 🎨 detective.scss
│
├── 📂 public/
│   ├── 📂 icons/                  # 앱 아이콘
│   ├── 📂 fonts/
│   │   ├── 📂 retro/
│   │   └── 📂 modern/
│   └── 📂 images/
│       └── 📂 wallpapers/
│
├── 📂 types/
│   ├── 📄 os.ts
│   ├── 📄 game.ts
│   └── 📄 mdx.d.ts
│
└── ⚙️ mdx-components.tsx          # MDX 설정
```

</details>

## 설치 및 실행

```bash
# 의존성 설치
pnpm install

# 개발 서버
pnpm dev

# 빌드
pnpm build

# 프로덕션 실행
pnpm start
```

## 라우팅

```
/                           # OS 데스크탑
/apps/blog                  # 블로그 메인
/apps/blog/post/[slug]      # 포스트
/apps/blog/category/[cat]   # 카테고리
/sites/[siteId]             # TRPG 사이트
```

## 라이선스

- **Code**: MIT (`LICENSE`)
- **Content** (`content/**`): CC BY-NC-SA 4.0 (`CONTENT-LICENSE`)
- Third-party assets (fonts/icons/sounds) follow their own licenses.


## 연락

이슈 또는 PR 환영.