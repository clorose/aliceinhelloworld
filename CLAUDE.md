# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **용어 사전**: [docs/glossary.md](docs/glossary.md)에서 프로젝트 용어 확인 (Finder vs Folder 등)

## Project Overview

**Alice in HelloWorld** is a personal blog and TRPG toolkit presented as a simulated macOS-style desktop environment. The entire application runs as an interactive desktop UI where features (Blog/Finder, Terminal, Settings) operate as draggable, resizable windows.

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 (CSS variables for theming)
- **State Management:** Zustand
- **Content:** MDX (dual-pipeline architecture - see below)
- **UI Components:** Framer Motion for animations, Radix UI primitives
- **Local Fonts:** Pretendard (variable), Hack (monospace)

## Development Commands

```bash
# Development server (runs generate:posts automatically)
pnpm dev

# Production build (includes post map generation)
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint

# Manually regenerate post map (required after adding/moving/renaming MDX files)
pnpm run generate:posts
```

## Critical Architecture: Dual-Pipeline MDX System

This is the most important architectural constraint in the codebase. There are TWO separate pipelines for handling MDX content:

### Pipeline 1: Metadata (Server-Side)
- **File:** `lib/posts.ts`
- **Purpose:** Extract frontmatter metadata from MDX files
- **Method:** Uses `fs` + `gray-matter` to read files, `zod` to validate
- **Output:** `BlogPost[]` with metadata only (title, date, description, tags, path, id)
- **Usage:** Server Components (`app/page.tsx`)

### Pipeline 2: Component Rendering (Build-Time)
- **Generator:** `scripts/generate-post-map.ts`
- **Output:** `lib/post-map.ts` (auto-generated, NEVER edit manually)
- **Purpose:** Maps post IDs to `next/dynamic` component imports
- **Method:** Scans `content/blog/**/*.mdx`, generates dynamic import map
- **Usage:** Client Components (`components/finder/PostReader.tsx`)

### Critical Rules
1. **NEVER manually edit `lib/post-map.ts`** - it's auto-generated
2. After adding/moving/renaming MDX files, run `pnpm run generate:posts`
3. Server Components can import MDX directly; Client Components must use `POST_MAP`
4. MDX files live in `content/blog/<domain>/<topic>/post-name.mdx`

## State Management Architecture

### Desktop Window System (`lib/stores/desktop-store.ts`)
Global Zustand store managing the entire desktop environment with **LocalStorage persistence**:

- **Window Management:** Open, close, minimize, maximize, z-index ordering
- **Window State:** Position, size, pre-maximized state restoration
- **Window Persistence:** Window positions/sizes saved to LocalStorage and restored on page reload
- **Active Window:** Focus tracking with `activeWindowId`
- **Mission Control:** Overview mode for all open windows
- **Window Limits:** Max 5 post windows (ID pattern: `post-*`)
- **Toast Notifications:** Global toast system for user feedback

Key methods:
- `openWindow()` - Creates or reopens a window, restores saved position/size if available
- `bringToFront()` - Updates z-index, focus, and restores minimized windows
- `toggleMaximize()` - Full-screen mode (accounts for 32px menu bar)
- `updateWindowPosition/Size()` - Used by drag/resize handlers, auto-saves to LocalStorage
- `resetWindowStates()` - Clear all saved window states

**Persistence**: Uses Zustand `persist` middleware to save `windowStates` to LocalStorage under key `alice-desktop-storage`.

### Theme System (`lib/stores/theme-store.ts`)
Global theme management with **LocalStorage persistence**:

- **Theme Modes:** `'light' | 'dark' | 'system'`
- **Auto-Detection:** Listens to OS dark mode preference when theme is `'system'`
- **Persistence:** Theme choice saved to LocalStorage under key `alice-theme-storage`
- **Class-Based:** Applies theme by adding/removing `dark` class on `<html>` element

Key methods:
- `setTheme(theme)` - Set theme explicitly
- `toggleTheme()` - Toggle between light and dark (maintains user choice)

### Window Component (`components/desktop/Window.tsx`)
- Draggable via Framer Motion `dragControls`
- Resizable via bottom-right corner handle
- macOS-style traffic light buttons (red/yellow/green)
- Memoized to prevent unnecessary re-renders

## Component Architecture

### Desktop Layer (`components/desktop/`)
- Desktop.tsx, Window.tsx, MenuBar.tsx, MissionControl.tsx, AppIcon.tsx

### Application Layer (`components/finder/`)
- FinderApp.tsx, PostList.tsx, PostReader.tsx

**Key Finder Features:**
- Tree structure mirrors `content/blog` folder hierarchy
- Keyboard navigation: ↑↓ to navigate, → expand, ← collapse, Enter to open
- **Advanced Search:**
  - Searches in slug, title, description, and tags
  - `#tag` syntax for tag filtering (e.g., `#ComfyUI`, `nodes #Chain-of-Thought`)
  - Yellow highlighting on matched text
  - Auto-expands folders containing search results
- Selection states: `selectedPostId` (selected post), `selectedNodePath` (keyboard focus)

See [components.md](docs/components.md) for detailed component API reference.

### Tree Structure System

```typescript
interface TreeNode {
  type: 'folder' | 'file'
  name: string
  fullPath: string          // 'ai/img/comfyui/nodes'
  children?: TreeNode[]      // Only for folders
  post?: BlogPost            // Only for files
}

interface BlogPost {
  id: string                 // 'ai/img/comfyui/nodes/post-1'
  slug: string               // 'post-1'
  path: string[]             // ['ai', 'img', 'comfyui', 'nodes']
  frontmatter: BlogPostFrontmatter
}
```

Built by `buildPostTree()` in `lib/tree-utils.ts`.

See [architecture.md](docs/architecture.md) for detailed project structure.

## MDX Frontmatter Schema

Every MDX file in `content/blog/` requires:

```yaml
---
title: "Post Title"
date: "YYYY-MM-DD"
description: "Brief description"
tags: ["tag1", "tag2"]  # Optional
---
```

Validated by Zod schema in `lib/posts.ts`. Invalid frontmatter falls back to defaults.

## Design System

**Principles:**
- Tailwind CSS 4 + CVA (class-variance-authority) for variants
- Design tokens in `lib/design-tokens.ts` and `tailwind.config.ts`
- Reusable components in `components/ui/` (Button, Card, TrafficLightButton)
- Dark mode support throughout

See [architecture.md](docs/architecture.md) for detailed design system documentation.

## Common Patterns

### Opening a Post Window
```typescript
const openReader = useCallback((post: BlogPost) => {
  openWindow({
    id: `post-${post.id}`,
    title: post.slug,
    icon: <Bot className="w-8 h-8 text-zinc-500" />,
    content: <PostReader post={post} onTagClick={() => {}} />,
  });
}, [openWindow]);
```

### Filtering Posts by RootPath
```typescript
// Desktop.tsx passes rootPath to Finder
<FinderApp
  posts={posts}
  initialPath={["ai"]}
  rootPath={["ai"]}     // Only show 'ai' subtree
  onOpenPost={openReader}
/>
```

### Tree Expansion
```typescript
const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

const toggleFolder = (path: string) => {
  setExpandedFolders(prev => {
    const next = new Set(prev);
    if (next.has(path)) {
      next.delete(path);
    } else {
      next.add(path);
    }
    return next;
  });
};
```

### Click/Double-Click Distinction
```typescript
const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

onClick={() => {
  if (clickTimeoutRef.current) {
    clearTimeout(clickTimeoutRef.current);
  }

  clickTimeoutRef.current = setTimeout(() => {
    onSelect(item);  // Single click
  }, 200);
}}

onDoubleClick={() => {
  if (clickTimeoutRef.current) {
    clearTimeout(clickTimeoutRef.current);
    clickTimeoutRef.current = null;
  }
  onOpen(item);  // Double click
}}
```

## Common Issues & Solutions

### Issue 1: Post Not Appearing After Creation
**Solution:** Run `pnpm run generate:posts`

### Issue 2: Files Opening Twice
**Cause:** `post.id` was modified in `postsWithRelativePaths`, breaking POST_MAP lookup
**Solution:** Keep original `post.id` unchanged, only modify `path` for tree display

### Issue 3: Duplicate Focus Highlights
**Cause:** `isSelected` used both `selectedNodePath` and `selectedPostId`
**Solution:** Use only `selectedNodePath`, sync via useEffect

### Issue 4: Focus Hijacking on Rerender
**Cause:** useEffect depended on `flatList`, any tree change triggered sync
**Solution:** Use `prevSelectedPostIdRef` to only sync when `selectedPostId` actually changes

```typescript
const prevSelectedPostIdRef = useRef<string | null>(null);

useEffect(() => {
  if (selectedPostId && selectedPostId !== prevSelectedPostIdRef.current) {
    prevSelectedPostIdRef.current = selectedPostId;
    const fileNode = flatList.find(
      ({ node }) => node.type === 'file' && node.post?.id === selectedPostId
    );
    if (fileNode) {
      setSelectedNodePath(fileNode.node.fullPath);
    }
  }
}, [selectedPostId]); // Only depend on selectedPostId, NOT flatList
```

### Issue 5: Hydration Error with MDX
**Solution:** Check Server/Client component boundaries. Server Components can import MDX directly, Client Components must use `POST_MAP`.

## Additional Documentation

- **[glossary.md](docs/glossary.md)** - Project terminology (Finder vs Folder, Window vs Dialog)
- **[architecture.md](docs/architecture.md)** - Detailed architecture deep dive
- **[components.md](docs/components.md)** - Component API reference
- **[plan.md](docs/plan.md)** - Development plan & priorities
- **[roadmap.md](docs/roadmap.md)** - Long-term roadmap
