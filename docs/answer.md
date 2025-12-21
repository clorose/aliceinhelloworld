# Answer - 질문 답변 모음

> 💡 **이 문서는 최신 Q&A를 임시로 작성하는 공간입니다.**
>
> 해결된 문제는 주제별로 정리하여 `docs/Archive/` 폴더로 이동합니다.

## 아카이브된 답변

- **Window 위치/드래그 관련**: [window-positioning.md](./Archive/window-positioning.md)
  - Q2: Window 드래그 시 위치가 튀는 문제
  - Q3: Window 드래그 종료 후 경계 밖으로 추가 이탈
  - Q6: Window가 항상 같은 위치에서 열림

- **Window 상태 관리**: [window-state-management.md](./Archive/window-state-management.md)
  - Q4: Window 최초 Open 직후 확대→축소 비정상
  - Q5: 최소화 후 MissionControl로 복원 안 됨

---

## Q1: ESLint `react-hooks/refs` 규칙을 전역으로 끈 것에 대한 반성

### 문제 상황
Dock magnification 구현 시 `getIconScale()`에서 render 중에 `iconRefs.current.get(iconId)`를 호출하여 ESLint 에러 발생.

### 잘못된 해결 방법 (현재)
```javascript
// eslint.config.mjs
"react-hooks/refs": "off",  // ❌ 전역 OFF
```

### 왜 잘못됐는가?

1. **"렌더링에 영향 없음"이라는 설명이 틀렸음**
   - `scale={getIconScale(app.id)}`는 ref에서 읽은 값을 props로 전달
   - 이건 UI를 직접 결정하는 렌더링 로직임
   - "magnification만 영향" ≠ "렌더링에 영향 없음" (모순)

2. **React 공식 문서가 명시적으로 금지**
   - `ref.current`는 렌더링 중 read/write 하면 안 됨 ([React useRef](https://react.dev/reference/react/useRef))
   - Render 중엔 DOM ref가 null이거나 업데이트 전 값일 수 있음
   - `refs` 규칙은 이를 방지하기 위한 정당한 규칙

3. **전역 OFF의 부작용**
   - 다른 파일에서 진짜 버그성 ref 사용이 생겨도 경고 안 뜸
   - 프로젝트 전체 품질 저하

### 올바른 해결 방법

#### A) 권장: 구조를 바꿔서 규칙 준수 (TODO)

**Framer Motion의 useMotionValue/useTransform 사용:**

```tsx
// Dock.tsx
const mouseX = useMotionValue(0);

const handleMouseMove = (e: React.MouseEvent) => {
  mouseX.set(e.clientX);
};

// DockIcon.tsx에서
const scale = useTransform(mouseX, (x) => {
  // 마우스 위치에 따른 scale 계산
  // 리렌더 없이 애니메이션 업데이트
});
```

**또는 useLayoutEffect로 캐시:**
```tsx
// 아이콘 위치를 commit 후 측정
useLayoutEffect(() => {
  pinnedApps.forEach(app => {
    const el = iconRefs.current.get(app.id);
    if (el) {
      iconPositions.current.set(app.id, getElementCenterX(el));
    }
  });
}, [pinnedApps]);

// render 중엔 캐시된 위치 사용
const getIconScale = (iconId: string) => {
  const centerX = iconPositions.current.get(iconId);
  // ref 대신 캐시 사용
};
```

#### B) 차선: 전역 OFF가 아니라 파일별 예외 (현재 적용)

```tsx
// Dock.tsx 파일 상단
/* eslint-disable react-hooks/refs */
```

최소한 다른 파일에서는 규칙이 작동하도록 함.

### 결론

- ✅ **완료 (2025-12-26)**: Framer Motion useMotionValue/useTransform으로 리팩터링
- ✅ render 중 ref 접근 완전히 제거
- ✅ ESLint `react-hooks/refs` 규칙 준수
- ✅ 성능 유지 (리렌더 없이 애니메이션만 업데이트)

### 최종 구조

**Dock.tsx:**
```tsx
// mouseX를 MotionValue로 관리 (리렌더 없음)
const mouseX = useMotionValue<number | null>(null);

// useLayoutEffect에서 아이콘 위치 측정 후 state에 저장
useLayoutEffect(() => {
  const positions: Record<string, number> = {};
  iconRefs.current.forEach((element, iconId) => {
    positions[iconId] = getElementCenterX(element);
  });
  queueMicrotask(() => setIconCenterPositions(positions));
}, [pinnedApps]);

// DockIcon에 MotionValue와 centerX 전달
<DockIcon mouseX={mouseX} iconCenterX={iconCenterPositions[app.id]} />
```

**DockIcon.tsx:**
```tsx
// useTransform으로 scale 계산 (리렌더 없음)
const scale = useTransform(mouseX, (x) => {
  if (x === null || iconCenterX === undefined) return 1;
  return calculateMagnification(x, iconCenterX);
});

// MotionValue를 style에 직접 전달
<motion.button style={{ scale, y }} />
```

### 참고 자료
- [React useRef](https://react.dev/reference/react/useRef)
- [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)
- [ESLint react-hooks/refs](https://react.dev/reference/eslint-plugin-react-hooks/lints/refs)
