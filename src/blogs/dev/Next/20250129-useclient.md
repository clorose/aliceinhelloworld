# 'use client' Directive

`'use client'` 지시문은 React Server Components에서 도입된 기능으로, 컴포넌트를 클라이언트 사이드에서 렌더링하도록 지정합니다. Next.js App Router는 이 React 기능을 기본적으로 채택하여 사용하고 있습니다.

## 기본 개념

React Server Components 환경에서는 모든 컴포넌트가 기본적으로 서버 컴포넌트입니다. `'use client'` 지시문을 사용하면 해당 모듈과 그 종속성들이 클라이언트에서 실행되도록 표시됩니다.

```tsx
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

## 사용 규칙

1. **파일 최상단 선언**
   - 모든 import문 이전에 위치해야 함
   - 주석만 허용됨
   - 작은따옴표(') 또는 큰따옴표(")만 사용 가능 (백틱 불가)

2. **모듈 영향 범위**
   - 해당 파일과 그 종속성들이 클라이언트 코드로 표시됨
   - 하위 모듈들도 자동으로 클라이언트 코드가 됨

## Server Components vs Client Components

### Server Components (기본값)
- 서버에서만 실행
- 파일 시스템 접근 가능
- 데이터베이스 직접 접근 가능
- 민감한 정보 접근 가능
- 번들 사이즈에 영향 없음
- 초기 페이지 로드 성능 최적화

### Client Components ('use client' 필요)
- 브라우저에서 실행
- useState, useEffect 등 React hooks 사용
- onClick 등 이벤트 핸들러 사용
- 브라우저 API 접근 (localStorage 등)
- 클라이언트 상태 관리
- 인터랙티브한 기능 구현

## 언제 'use client'를 사용해야 하나?

다음과 같은 경우에 'use client'를 사용해야 합니다:

1. **React Hooks 사용 시**
```tsx
'use client'

import { useState, useEffect } from 'react'

export default function Example() {
  const [data, setData] = useState(null)
  useEffect(() => {
    // ...
  }, [])
  return <div>{/* ... */}</div>
}
```

2. **브라우저 API 사용 시**
```tsx
'use client'

export default function LocalStorage() {
  const theme = localStorage.getItem('theme')
  return <div>{/* ... */}</div>
}
```

3. **이벤트 핸들러 사용 시**
```tsx
'use client'

export default function Button() {
  return <button onClick={() => alert('Clicked!')}>Click me</button>
}
```

## 데이터 전달 제한사항

Server Component에서 Client Component로 props를 전달할 때는 직렬화 가능한 값만 전달할 수 있습니다.

### 전달 가능한 값
- 기본 타입 (string, number, boolean 등)
- 배열, 객체 (직렬화 가능한 값들로 구성된)
- Date 객체
- JSX 요소
- Promise
- Map, Set
- ArrayBuffer, TypedArray

### 전달 불가능한 값
- 일반 함수 ('use server' 표시된 것 제외)
- 클래스 인스턴스
- 전역이 아닌 Symbol
- WeakMap, WeakSet
- 정규표현식 객체

## 예제: 서버와 클라이언트 컴포넌트 조합

```tsx
// ServerComponent.tsx
// 기본적으로 서버 컴포넌트
import ClientComponent from './ClientComponent'

async function getData() {
  const res = await fetch('https://api.example.com/data')
  return res.json()
}

export default async function ServerComponent() {
  const data = await getData()
  return (
    <div>
      <h1>Server Component</h1>
      <ClientComponent data={data} /> {/* 직렬화 가능한 데이터만 전달 */}
    </div>
  )
}

// ClientComponent.tsx
'use client'

import { useState } from 'react'

export default function ClientComponent({ data }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>Toggle</button>
      {isOpen && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  )
}
```

## 참고 자료
- [React 'use client' Documentation](https://react.dev/reference/rsc/use-client)
- [Next.js 'use client' Documentation](https://nextjs.org/docs/app/api-reference/directives/use-client)