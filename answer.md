# 남은 작업 항목

## ✅ 완료된 작업
1. ~~로딩 스피너 개선~~ - macOS 스타일 12-bar 회전 인디케이터 완료
2. ~~Error boundary UI 개선~~ - Try Again/Reload 버튼, 노란색 경고 아이콘, 개발자 모드 완료
3. ~~Window 애니메이션~~ - 제자리에서 fade + scale 효과 (0.9 → 1.0) 정상 작동

---

## 🎨 실용적인 UI/UX 개선 (3개)

### 1. Window snap grid (정렬 가이드) ⭐⭐⭐

**설명**: 창을 드래그할 때 화면 가장자리나 다른 창에 가까워지면 가이드라인이 나타나고 자석처럼 붙는 기능.

**예시**:
- 창을 화면 왼쪽 끝으로 드래그 → 반투명 가이드라인 표시 → 놓으면 정확히 왼쪽 절반에 배치
- 두 창이 가까워지면 → 빨간 정렬선 표시 → 자동으로 가장자리 정렬

**왜 유용한가**:
- Windows/macOS 기본 기능
- 창 정렬할 때 훨씬 편함
- 멀티태스킹 생산성 향상

**구현 포인트**:
- Window.tsx의 `onDragEnd` 핸들러 수정
- 드래그 중 마우스 위치 추적
- 화면/다른 창과의 거리 계산 (20px threshold)
- SVG 가이드라인 렌더링

---

### 2. Mission Control 개선 (썸네일 크기 조정) ⭐⭐

**설명**: 현재 Mission Control에서 모든 창을 보여줄 때 썸네일 크기/레이아웃 개선.

**현재 문제**:
- 창이 많으면 썸네일이 너무 작아짐
- 레이아웃이 비효율적
- 어떤 창인지 알아보기 어려움

**개선 방안**:
- 창 개수에 따라 동적으로 썸네일 크기 조정
- Grid 레이아웃 최적화 (2x2, 3x3 등)
- 호버 시 썸네일 확대 (macOS Exposé 스타일)
- 썸네일에 창 제목 표시

**구현 파일**: `components/desktop/MissionControl.tsx`

---

### 3. Window 간 드래그 앤 드롭 ⭐

**설명**: Finder에서 포스트를 드래그해서 다른 창으로 드롭하면 바로 열림.

**예시**:
- Finder 포스트 목록에서 드래그 → PostReader 창 위에 드롭 → 해당 포스트 열림

**구현 포인트**:
- HTML5 Drag & Drop API
- PostList.tsx에 draggable 추가
- Window.tsx에 drop zone 추가

**우선순위**: 낮음 (있으면 좋지만 없어도 됨)

---

## 🎬 애니메이션 (선택사항)

### 1. Menu 드롭다운

**설명**: 메뉴바 클릭 시 File/Edit 같은 드롭다운 메뉴 추가.

**현재 상태**: MenuBar는 있지만 메뉴 기능 없음

**추가할 기능**:
- File: New Window, Close, Quit
- Edit: Cut, Copy, Paste
- View: Mission Control, Show Desktop
- 단축키 표시 (⌘K, ⌘Q 등)

**우선순위**: 중간 (실제 기능 추가가 되므로 유용함)

---

### 2. Dock 아이콘 bounce 효과

**설명**: 앱 실행 시 Dock 아이콘이 통통 튀는 애니메이션.

**구현**:
```tsx
<motion.div
  animate={{ y: [0, -20, 0, -10, 0] }}
  transition={{ duration: 0.6 }}
>
  {icon}
</motion.div>
```

**우선순위**: 낮음 (눈에 띄는 효과 적음)

---

### 3. Genie effect (지니 효과) ❌

**시도했으나 실패**: Dock에서 창이 나오는 물결 애니메이션

**문제점**:
- Framer Motion의 x, y 좌표 계산이 복잡함
- 창이 랜덤한 위치에서 나타남
- 실제 구현하려면 Canvas/SVG path 애니메이션 필요

**결론**: 구현 복잡도 대비 효과 미미, 보류

---

## 🎯 추천 작업 순서

### 실용성 중심:
1. **Window snap grid** - 가장 유용함, 창 정렬 편해짐
2. **Mission Control 개선** - 현재 불편한 부분 해결
3. **Menu 드롭다운** - 실제 기능 추가

### 완성도 중심:
1. Mission Control 개선
2. Menu 드롭다운
3. Window snap grid

---

## 🚫 제외할 항목

- ~~Genie effect~~ - 구현 복잡, 효과 미미
- ~~Page transition~~ - 현재 구조에 불필요
- ~~Dock bounce~~ - 눈에 띄는 효과 없음
- ~~Window 간 드래그 앤 드롭~~ - 우선순위 낮음
