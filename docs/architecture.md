# Architecture - Alice in HelloWorld

## Project Structure

```
app/                      # Next.js App Router
├── layout.tsx           # Root layout (fonts, metadata)
├── page.tsx             # Homepage (renders Desktop)
└── loading.tsx          # Global loading state

components/
├── desktop/             # Desktop environment
│   ├── Desktop.tsx      # Main desktop container
│   ├── Window.tsx       # Draggable/resizable windows
│   ├── MenuBar.tsx      # Top menu bar
│   ├── AppIcon.tsx      # Desktop app icons
│   └── MissionControl.tsx # Window overview (Cmd+`)
├── finder/              # Finder (blog explorer)
│   ├── FinderApp.tsx    # Main Finder container
│   ├── PostList.tsx     # File/folder tree view
│   ├── PostReader.tsx   # MDX post viewer
│   └── Sidebar.tsx      # Folder navigation
├── ui/                  # Reusable UI components
│   ├── Button.tsx       # Button with variants
│   ├── Card.tsx         # Card layouts
│   └── TrafficLightButton.tsx # macOS window controls
└── mdx-components.tsx   # MDX custom components

content/blog/            # MDX blog posts
└── <domain>/<topic>/<subtopic>/post-name.mdx

lib/
├── posts.ts             # Post utilities (getAllPosts)
├── tree-utils.ts        # Tree building (buildPostTree)
├── post-map.ts          # Auto-generated MDX imports
├── design-tokens.ts     # Design system utilities
└── stores/
    └── desktop-store.ts # Global Zustand store

scripts/
└── generate-post-map.ts # Post map generator script

docs/                    # Documentation
├── glossary.md          # Project terminology
├── plan.md              # Development plan
├── roadmap.md           # Long-term roadmap
├── architecture.md      # This file
└── components.md        # Component guide

public/fonts/            # Local fonts (Pretendard, Hack)
```

---

## MDX Dual-Pipeline Architecture

### Problem
Next.js MDX has two render contexts:
1. **Server Components** (can import MDX directly)
2. **Client Components** (cannot use dynamic imports)

### Solution: Dual Pipeline

#### Pipeline 1: Metadata Extraction (Server)
- `lib/posts.ts` uses `gray-matter` to parse frontmatter
- Returns `BlogPost[]` with metadata only
- Used for: List views, search, filtering

#### Pipeline 2: Component Rendering (Client)
- `scripts/generate-post-map.ts` generates dynamic import map
- `lib/post-map.ts` exports `POST_MAP` with lazy-loaded MDX
- Used for: Rendering full post content in `<PostReader>`

### Critical Rules
1. After adding/moving/renaming MDX files, run `pnpm run generate:posts`
2. Server Components can import MDX directly
3. Client Components must use `POST_MAP`
4. MDX files live in `content/blog/<domain>/<topic>/post-name.mdx`

---

## MDX Frontmatter Schema

Every MDX file requires:

```yaml
---
title: "Post Title"
date: "YYYY-MM-DD"
description: "Brief summary"
tags: ["tag1", "tag2"]  # optional
---
```

Validated by Zod schema in `lib/posts.ts`.

---

## State Management Architecture

### Global State (Zustand)

**Store:** `lib/stores/desktop-store.ts`

```typescript
interface DesktopState {
  // Window management
  windows: DesktopWindow[]
  activeWindowId: WindowId | null
  nextZIndex: number

  // UI state
  missionControlOpen: boolean
  showDesktop: boolean

  // Toast notifications
  toast: { message: string; type: "error" | "info" } | null

  // Actions
  openWindow: (window) => void
  closeWindow: (id) => void
  minimizeWindow: (id) => void
  toggleMaximize: (id) => void
  bringToFront: (id) => void
  updateWindowSize: (id, size) => void
  updateWindowPosition: (id, position) => void
}
```

### Local State (React useState)

**Finder state:**
- `currentPath`: Current folder path
- `selectedPostId`: Selected post for highlighting
- `selectedNodePath`: Keyboard navigation focus
- `expandedFolders`: Set of expanded folder paths
- `searchTerm`: Search query

**PostList state:**
- `expandedFolders`: Tree expansion state
- `selectedNodePath`: Keyboard focus tracking

---

## Tree Structure System

### Types

```typescript
interface TreeNode {
  type: 'folder' | 'file'
  name: string
  fullPath: string          // 'ai/img/comfyui/nodes'
  children?: TreeNode[]      // Only for folders
  post?: BlogPost            # Only for files
}

interface BlogPost {
  id: string                 // 'ai/img/comfyui/nodes/post-1'
  slug: string               // 'post-1'
  path: string[]             // ['ai', 'img', 'comfyui', 'nodes']
  frontmatter: BlogPostFrontmatter
}
```

### Tree Building (`lib/tree-utils.ts`)

```typescript
buildPostTree(posts: BlogPost[]): TreeNode[]
```

1. Creates folder nodes for each path segment
2. Creates file nodes for each post
3. Sorts: folders first, then alphabetically
4. Returns hierarchical tree structure

---

## Window System

### Window Lifecycle

1. **Creation**: `openWindow()` in desktop-store
   - Check if window exists (by id)
   - If exists: bring to front
   - If new: create with `zIndex = nextZIndex++`
   - Limit: 5 post windows max

2. **Management**:
   - Drag: framer-motion `drag` + `dragControls`
   - Resize: pointer events on bottom-right handle
   - Z-index: Auto-increment on focus

3. **Cleanup**: `closeWindow(id)` removes from store

### Window Props

```typescript
interface DesktopWindow {
  id: WindowId                    // Unique identifier
  title: string                   // Title bar text
  icon: React.ReactNode           # Icon in title bar
  content: React.ReactNode        // Window content
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
  position?: { x: number; y: number }
  size?: { width: number; height: number }
  preMaximizedPosition?: { x: number; y: number }
  preMaximizedSize?: { width: number; height: number }
}
```

---

## Keyboard Navigation System

### Finder PostList Navigation

**Keys:**
- `↑/↓`: Navigate files and folders
- `→`: Expand folder
- `←`: Collapse folder
- `Enter`: Open file (double-click) / Toggle folder
- `Space`: Select item

**Focus Management:**
- `selectedNodePath`: Tracks keyboard focus
- Synced with `selectedPostId` when file is clicked
- Auto-scroll to keep focused item visible

---

## Routing & Navigation

**Single Page Application:**
- All navigation happens via `openWindow()` in Zustand store
- No Next.js router navigation
- Desktop persists, windows open/close dynamically

---

## Critical Design Decisions

### 1. Why No Server-Side Routing?
- Desktop metaphor requires persistent UI
- Window state (position, size) must survive navigation
- Simpler state management with client-side only

### 2. Why Dual MDX Pipeline?
- Server Components for metadata extraction (SEO, fast lists)
- Client Components for interactive rendering (windows)
- Best of both worlds

### 3. Why Zustand over Context?
- Simpler API
- No provider hell
- Better DevTools
- Atomic updates

### 4. Why Framer Motion over dnd-kit?
- Window dragging needs physics/momentum
- Framer Motion better for desktop metaphor
- dnd-kit reserved for list reordering (Dock, later)

---

## Performance Considerations

- MDX files lazy-loaded via `dynamic()` import
- Window components memoized with `React.memo`
- PostList uses `useMemo` for tree building
- Search/filter operations debounced (future)
