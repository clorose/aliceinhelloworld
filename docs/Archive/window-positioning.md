# Window 위치/드래그 관련 트러블슈팅

## Q6: Window가 항상 같은 위치에서 열림 (2025-12-26)

### 문제
1. AppIcon을 클릭해서 Finder를 여러 번 열기
2. **항상 (100, 100) 위치에서 열림**
3. Window끼리 완전히 겹쳐서 구분 안 됨

### 원인
`openWindow`에서 하드코딩된 기본 위치 사용:

```tsx
// 문제가 있던 코드
position: newWindow.position || { x: 100, y: 100 },
```

**왜 문제?**
- 모든 Window가 같은 위치에서 시작
- 여러 Window 열면 겹쳐서 보기 불편
- macOS는 cascade나 랜덤 배치 사용

### 해결책

**Window 크기만큼 범위 내에서 랜덤 배치:**

```tsx
// Random position within window size range
const defaultSize = newWindow.size || { width: 800, height: 600 };
const randomX = Math.floor(Math.random() * defaultSize.width);
const randomY = Math.floor(32 + Math.random() * defaultSize.height); // 32px for MenuBar

position: newWindow.position || { x: randomX, y: randomY }
```

### 동작 원리
1. **Window 기본 크기**: 800x600
2. **랜덤 범위**: x는 0~800, y는 32~632
3. **랜덤 위치 생성**: 범위 내에서 랜덤
4. **Window 배치**: 적당히 퍼져서 배치, 너무 멀리 가지 않음

### 결과
✅ Window마다 다른 위치에서 열림
✅ 적당한 범위 내에서 배치 (너무 멀리 안 감)
✅ 여러 Window 열어도 구분하기 쉬움
✅ 간단하고 자연스러움

---

## Q3: Window 드래그 종료 후 경계 밖으로 추가 이탈 (2025-12-26)

### 문제
1. Window를 Desktop 경계 밖으로 드래그
2. 드래그 중에는 경계에서 멈춤 (정상)
3. **드래그를 놓는 순간** 경계 밖으로 추가 이탈
4. 추가 이탈량 = 경계 밖으로 "민 이동량"에 비례

### 원인
`dragConstraints`는 드래그 중에만 작동하고, `onDragEnd`에서는 적용 안 됨:

```tsx
// 문제가 있던 코드
onDragEnd={(_, info) => {
  if (!window.isMaximized) {
    const currentX = window.position?.x || 100;
    const currentY = window.position?.y || 100;
    updateWindowPosition(window.id, {
      x: currentX + info.offset.x,  // ← 경계 체크 없음!
      y: currentY + info.offset.y,
    });
  }
}}
```

**왜 문제?**
- 드래그 중: framer-motion의 `dragConstraints`가 경계 제한
- 드래그 끝: `offset`을 그대로 더하면서 경계 무시
- 경계 밖으로 민 만큼 그대로 적용되어 이탈

### 해결책

**onDragEnd에서 수동 clamp 처리 추가:**

```tsx
onDragEnd={(_, info) => {
  if (!window.isMaximized && constraintsRef?.current) {
    const currentX = window.position?.x || 100;
    const currentY = window.position?.y || 100;

    const newX = currentX + info.offset.x;
    const newY = currentY + info.offset.y;

    // Clamp to desktop bounds
    const desktopWidth = constraintsRef.current.clientWidth;
    const desktopHeight = constraintsRef.current.clientHeight;
    const windowWidth = window.size?.width || 800;
    const windowHeight = window.size?.height || 600;

    const clampedX = Math.max(0, Math.min(newX, desktopWidth - windowWidth));
    const clampedY = Math.max(32, Math.min(newY, desktopHeight - windowHeight)); // 32px for MenuBar

    updateWindowPosition(window.id, {
      x: clampedX,
      y: clampedY,
    });
  }
}}
```

### 동작 원리
1. **드래그 중**: framer-motion이 dragConstraints로 경계 제한
2. **드래그 끝**: offset 계산 → Desktop 경계 기준 clamp → position 업데이트
3. **Window 크기 고려**: Desktop width/height에서 Window 크기 뺀 값이 최대 좌표

### 결과
✅ 드래그 종료 후 경계 밖으로 이탈 안 함
✅ 경계 밖으로 아무리 밀어도 정확히 경계에 딱 붙음
✅ Maximize/Restore와 무관하게 항상 경계 내부 유지

---

## Q2: Window 드래그 시 위치가 튀는 문제 (2025-12-26)

### 문제
1. Window를 드래그할 때 관성이 느껴짐
2. 어딘가에 붙는 느낌
3. **Maximize 후 Restore하면 위치가 튀거나 제어를 벗어남**

### 원인
Window.tsx에서 framer-motion의 `drag`와 `animate`가 충돌:

```tsx
// 문제가 있던 코드
animate={{
  scale: 1,
  opacity: 1,
  x: window.position?.x || 100,  // ← 문제!
  y: window.position?.y || 100,  // ← 문제!
}}
```

**왜 문제?**
- framer-motion의 `drag`는 내부적으로 `transform: translate(x, y)` 사용
- `animate`에서도 x/y를 계속 업데이트하면 서로 충돌
- 드래그 중에 animate가 position을 강제로 덮어쓰려고 함
- 드래그 끝나면 offset 계산이 꼬여서 이상한 위치로 튐

### 해결책

**변경 1: initial에서 x/y 제거**
```tsx
initial={{
  scale: 0.9,
  opacity: 0,
  // x/y 제거 - 초기 위치는 animate에서만
}}
```

**변경 2: dragElastic={0} 추가**
```tsx
drag={!window.isMaximized && !isResizing}
dragElastic={0}  // ← 경계에서 elastic 효과 제거
```

**변경 3: onDragEnd만 사용 (onDrag 사용 안 함)**
```tsx
onDragEnd={(_, info) => {
  if (!window.isMaximized) {
    const currentX = window.position?.x || 100;
    const currentY = window.position?.y || 100;
    updateWindowPosition(window.id, {
      x: currentX + info.offset.x,
      y: currentY + info.offset.y,
    });
  }
}}
```

### 동작 원리
1. **Window 처음 열릴 때**: scale/opacity 애니메이션만
2. **Position 변경 시**: animate의 x/y가 부드럽게 이동
3. **드래그 중**: framer-motion이 transform으로 자체 처리 (store 업데이트 없음)
4. **드래그 끝**: offset 계산해서 position 업데이트 → animate가 새 위치로 이동

### 결과
✅ 드래그 시 위치가 튀지 않음
✅ Maximize/Restore 시 정확한 위치 복원
✅ 경계에서 elastic 효과 없음 (딱 멈춤)
