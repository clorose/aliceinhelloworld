# Window 상태 관리 트러블슈팅

## Q5: 최소화 후 MissionControl로 복원 안 됨 (2025-12-26)

### 문제
**케이스 1: Traffic Light 최소화**
1. Window의 노란색 버튼으로 최소화
2. MissionControl 열기 (Ctrl+`)
3. Window 클릭
4. **Window가 복원되지 않음**

**케이스 2: Home 버튼으로 Desktop 숨김**
1. MenuBar의 Home 버튼(🏠) 클릭 → 모든 Window 숨김
2. MissionControl 열기 (Ctrl+`)
3. Window 클릭
4. **Window가 여전히 보이지 않음**

### 원인

**공통 원인**: MissionControl에서 Window 클릭 시 `bringToFront`만 호출:

```tsx
// MissionControl.tsx:48-51
onClick={() => {
  bringToFront(window.id);
  toggleMissionControl();
}}
```

그런데 `bringToFront`는 zIndex만 올리고 `isMinimized`와 `showDesktop`을 건드리지 않음:

```tsx
// 문제가 있던 코드
bringToFront: (id: WindowId) => {
  set((state) => {
    const newZIndex = state.nextZIndex >= MAX_Z_INDEX ? BASE_Z_INDEX : state.nextZIndex;
    return {
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: newZIndex } : w  // isMinimized, showDesktop 안 바꿈!
      ),
      activeWindowId: id,
      nextZIndex: newZIndex + 1,
    };
  });
}
```

**케이스별 원인**:

**케이스 1 (Traffic Light 최소화)**:
- Window가 `isMinimized: true` 상태로 남음
- Desktop.tsx:142에서 `!window.isMinimized` 조건으로 렌더링 안 함

**케이스 2 (Home 버튼)**:
- `showDesktop: true` 상태로 남음
- Desktop.tsx:137에서 `!showDesktop` 조건으로 모든 Window 숨김

### 해결책

**bringToFront에서 isMinimized와 showDesktop 모두 false로 변경:**

```tsx
bringToFront: (id: WindowId) => {
  set((state) => {
    const newZIndex = state.nextZIndex >= MAX_Z_INDEX ? BASE_Z_INDEX : state.nextZIndex;
    return {
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: newZIndex, isMinimized: false } : w
      ),
      activeWindowId: id,
      showDesktop: false,  // ← Home 버튼 케이스 해결
      nextZIndex: newZIndex + 1,
    };
  });
}
```

### 동작 원리
1. **MissionControl에서 Window 클릭**: bringToFront 호출
2. **bringToFront**:
   - zIndex 증가 (앞으로 가져오기)
   - isMinimized를 false로 변경 (케이스 1 해결)
   - showDesktop을 false로 변경 (케이스 2 해결)
3. **Window 복원**: Desktop.tsx 렌더링 조건 충족 → 화면에 나타남

### 결과
✅ Traffic Light 최소화 후 MissionControl로 복원 가능
✅ Home 버튼으로 숨긴 후에도 MissionControl로 복원 가능
✅ 별도의 restore 함수 불필요
✅ bringToFront의 의미에 더 부합 (앞으로 가져온다 = 보이게 한다)

---

## Q4: Window 최초 Open 직후 확대→축소 비정상 (2025-12-26)

### 문제
1. AppIcon 클릭으로 Window를 새로 Open
2. 트랙패드 제스처로 확대
3. 확대 시 좌측 여백 발생 (화면을 꽉 채우지 않음)
4. 축소가 동작하지 않거나, 되더라도 Window가 다른 위치로 이동
5. Title Bar를 드래그하면 그제서야 정상 동작

### 원인
Window를 처음 열 때 `position`과 `size`가 `undefined`로 시작:

```tsx
// 문제가 있던 코드
openWindow: (newWindow) => {
  // ...
  set((state) => ({
    windows: [
      ...state.windows,
      {
        ...newWindow,
        // position과 size가 undefined일 수 있음!
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: newZIndex,
      },
    ],
  }));
}
```

**왜 문제?**
- Window가 `position: undefined`, `size: undefined`로 열림
- Maximize할 때 `preMaximizedPosition = undefined` 저장
- Restore할 때 `undefined`로 복원하려고 시도
- framer-motion의 animate가 undefined를 처리 못해 위치가 꼬임

### 해결책

**수정 1: openWindow에서 기본값 설정**
```tsx
openWindow: (newWindow) => {
  // ...
  set((state) => ({
    windows: [
      ...state.windows,
      {
        ...newWindow,
        isOpen: true,
        isMinimized: false,
        isMaximized: false,
        zIndex: newZIndex,
        // 기본값 명시적 설정
        position: newWindow.position || { x: 100, y: 100 },
        size: newWindow.size || { width: 800, height: 600 },
      },
    ],
  }));
}
```

**수정 2: toggleMaximize에서 fallback 추가**
```tsx
toggleMaximize: (id) => {
  set((state) => ({
    windows: state.windows.map((w) => {
      if (w.id !== id) return w;

      if (w.isMaximized) {
        // Restore - fallback 추가
        return {
          ...w,
          isMaximized: false,
          position: w.preMaximizedPosition || w.position || { x: 100, y: 100 },
          size: w.preMaximizedSize || w.size || { width: 800, height: 600 },
        };
      } else {
        // Maximize - fallback 추가
        return {
          ...w,
          isMaximized: true,
          preMaximizedPosition: w.position || { x: 100, y: 100 },
          preMaximizedSize: w.size || { width: 800, height: 600 },
          position: { x: 0, y: 32 },
          size: { width: globalThis.window.innerWidth, height: globalThis.window.innerHeight - 32 },
        };
      }
    }),
  }));
}
```

### 동작 원리
1. **Window Open 시**: position/size가 항상 정의된 값 가짐
2. **Maximize 시**: 현재 position/size를 preMaximized에 저장 (undefined 없음)
3. **Restore 시**: preMaximized 값으로 복원 (항상 유효한 값)
4. **framer-motion**: animate의 x/y가 항상 유효한 숫자 받음

### 결과
✅ Window Open 직후에도 확대 시 좌측 여백 없음
✅ 축소가 즉시 정상 동작
✅ 위치 이동 없이 정확한 복원
✅ Title Bar 드래그 없이도 정상 동작
