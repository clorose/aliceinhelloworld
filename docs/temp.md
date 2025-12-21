⏺ UI 컴포넌트 모두 완성했습니다.

  생성한 컴포넌트 (5개)

  1. Input (components/ui/Input.tsx)

  - CVA variants: default, error, success
  - Sizes: sm, md, lg
  - forwardRef 지원
  - 예시: <Input variant="error" placeholder="Enter email..." />

  2. Badge (components/ui/Badge.tsx)

  - Variants: primary, success, warning, error, neutral
  - 작고 둥근 디자인 (rounded-full)
  - 예시: <Badge variant="success">New</Badge>

  3. Tooltip (components/ui/Tooltip.tsx)

  - 4방향 위치: top, right, bottom, left
  - 커스터마이징 가능한 delay (기본 200ms)
  - 마우스 호버 시 표시
  - 예시: <Tooltip content="Close window"><button>×</button></Tooltip>

  4. Dropdown (components/ui/Dropdown.tsx)

  - Radix UI Popover 기반
  - 선택된 옵션 체크마크 표시
  - 옵션 disabled 지원
  - Variants: default, ghost
  - 예시:
  <Dropdown
    options={[
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' }
    ]}
    value={theme}
    onChange={setTheme}
  />

  5. ContextMenu (components/ui/ContextMenu.tsx)

  - 우클릭 메뉴
  - 브라우저 기본 컨텍스트 메뉴 차단
  - 마우스 커서 위치에 표시
  - 뷰포트 경계 감지 (화면 밖으로 안 나감)
  - 아이콘, 단축키 표시 지원
  - 예시:
  <ContextMenu
    items={[
      { label: 'Open', onClick: handleOpen, icon: <FolderOpen /> },
      { label: 'Rename', onClick: handleRename, shortcut: '⌘R' },
      { separator: true },
      { label: 'Delete', onClick: handleDelete, icon: <Trash /> }
    ]}
  >
    <div>Right-click me</div>
  </ContextMenu>

  공통 특징

  - ✅ CVA로 variant 관리
  - ✅ Design tokens 일관성
  - ✅ Dark mode 지원
  - ✅ forwardRef 패턴
  - ✅ Framer Motion 애니메이션
  - ✅ 접근성 (ARIA, keyboard 지원)

  이제 Settings 앱이나 다른 작업을 진행할까요?