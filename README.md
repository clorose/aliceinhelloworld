# Multi-Blog OS

## 프로젝트 소개
Next.js와 React 기반 OS 스타일 블로그
- OS 스타일 UI
- 주제별 블로그 구분 (개발/TIL/TRPG 등)
- MDX 기반 포스팅
- 키보드 중심 조작(TBD)

## 주요 기능

- 📂 통합 파일 시스템
- 💻 터미널 기반 고급 제어
- 🌓 다크 모드 지원
- 🔍 통합 검색 기능
- 📱 반응형 디자인

## 시스템 구조

### 프로젝트 구조
```
~/Develop/aliceinhelloworld/
└── src/
   ├── app/           # Next.js App Router 구조
   │   ├── admin/     # 관리자 인터페이스
   │   ├── api/       # API 엔드포인트
   │   ├── layout.tsx # 루트 레이아웃
   │   ├── page.tsx   # 메인 페이지
   │   └── post/      # 블로그 포스트 관련
   ├── components/    # React 컴포넌트
   ├── hooks/         # 커스텀 훅
   ├── lib/           # 유틸리티 & 설정
   ├── public/        # 정적 파일
   ├── styles/        # 글로벌 스타일
   ├── types/         # TypeScript 타입
   └── blogs/         # 블로그 콘텐츠
       ├── TIL/       # TIL 블로그
       │   ├── posts/     # MDX 파일들
       │   └── images/    # TIL 관련 이미지
       ├── dev/       # 개발 블로그
       │   ├── posts/     # MDX 파일들
       │   └── images/    # 개발 블로그 이미지
       └── trpg/      # TRPG 블로그
           ├── posts/     # MDX 파일들
           └── images/    # TRPG 관련 이미지
```

## 애플리케이션

### 블로그 앱
1. **DevBlog.app**
   - 개발 관련 포스팅 특화
   - 코드 하이라이팅
   - 마크다운 에디터
   - GitHub 연동
   - 기술 스택 태그

2. **TRPGBlog.app**
   - TRPG 컨텐츠 특화
   - WYSIWYG 에디터
   - 캐릭터/세션 관리
   - 룰북 통합

### 시스템 앱
- **Files.app**: 통합 파일 시스템 관리
- **Portfolio.app**: 프로젝트 쇼케이스
- **Terminal.app**: 명령어 기반 관리
- **Settings.app**: 시스템 설정

## 개발 가이드

### Git 활용

기본적으로 `develop` 브랜치에서 개발을 진행하며, 각 블로그별로 `feature/*` 브랜치를 생성하여 작업한다.
작업이 완료되면 `develop` 브랜치로 PR을 생성하고, 코드 리뷰를 거쳐 `main` 브랜치에 한다.
깃 커밋 메세지는 아래의 규칙을 따른다. (깃모지와 Type을 함께 사용)

```
🔥 [Type] : title

[Description]

[Resolves] : #issueNumber
```

### 커밋 메시지 규칙
- **feat**: 새로운 기능 추가 `feat: Add search functionality to header`
- **fix**: 버그 수정 `fix: Fix infinite loop in pagination`
- **docs**: 문서 수정 `docs: Update README with commit guidelines`
- **style**: 코드 스타일 변경 `style: Format user service according to style guide`
- **design**: UI 디자인 변경 `design: Update primary button styles`
- **refactor**: 코드 리팩토링 `refactor: Simplify order processing logic`
- **test**: 테스트 관련 `test: Add integration tests for auth flow`
- **build**: 빌드 관련 `build: Update webpack configuration`
- **perf**: 성능 개선 `perf: Optimize image loading in feed`
- **chore**: 자잘한 수정 `chore: Update dependencies`
- **rename**: 파일/폴더명 수정 `rename: Rename UserComponent to UserProfile`
- **remove**: 파일 삭제 `remove: Remove unused utility functions`
- **revert**: 되돌리기 `revert: Revert "feat: Add new feature"`

### Branch Strategy
- main: 실제 배포되는 안정화 브랜치
- develop: 개발 완료된 기능들이 모이는 브랜치
- feature/*: 새 기능 개발 브랜치

## 기술 스택

### Core
| 기술       | 버전   | 설명                           |
| ---------- | ------ | ------------------------------ |
| Next.js    | 15.1.5 | App Router & Server Components |
| React      | 19.0.0 | UI 라이브러리                  |
| TypeScript | 5.7.3  | 타입 시스템                    |

### Frontend
| 기술         | 버전  | 설명        |
| ------------ | ----- | ----------- |
| Tailwind CSS | 4.0.0 | 스타일링    |
| clsx         | 2.1.1 | 클래스 관리 |
| next-themes  | 0.4.4 | 다크모드    |

### Data
| 기술    | 버전  | 설명            |
| ------- | ----- | --------------- |
| Zustand | 5.0.3 | 상태 관리       |
| ky      | 1.7.4 | HTTP 클라이언트 |

### Content
| 기술            | 버전  | 설명       |
| --------------- | ----- | ---------- |
| next-mdx-remote | 5.0.0 | MDX 처리   |
| gray-matter     | 4.0.3 | 프론트매터 |
| slugify         | 1.6.6 | URL 슬러그 |
| date-fns        | 3.6.0 | 날짜 처리  |

## 개발 로드맵

### MVP (Minimum Viable Product)
- OS 스타일 기본 UI (Desktop, Window)
- 마크다운 기반 블로그 포스팅
- 기본 파일 시스템
- 다크모드
- 반응형 디자인

### Phase 1: 기본 기능
- 📝 마크다운 에디터 개선
- 🎯 카테고리와 태그 시스템
- 🔍 검색 기능
- 💻 터미널 앱

### Phase 2: 글쓰기 개선
- 🎨 WYSIWYG 에디터
- 💻 코드 에디터
- 📝 실시간 미리보기

### Phase 3: 소통 기능
- 💬 댓글 시스템
- 📨 이메일 구독
- 🔔 알림 기능

### Phase 4: 시스템 개선
- 📊 방문자 분석
- 🌏 다국어 지원
- 🔄 자동 배포


## 잡소리

Next.js와 React를 사용하여 구축된 OS 스타일의 멀티 블로그 & 포트폴리오 사이트.
Ubuntu의 디자인에서 영감을 받아 OS 스타일의 인터페이스를 구현하였다.
처음에는 하이텔같은 블로그를 생각했다. 왜냐면 마우스 누르기 귀찮아서 키보드로만 조작하고 싶었기 때문이다.
막상 피그마로 만들려고 보니 파란색을 계속 보고 있자니 눈의 피로도가 높아져서 검은색으로 만들어보려 했다.
Windows 터미널 스타일로 만들어 보려고 했지만 이렇게 되니 하이텔이 아닌거같아서 현재의 디자인으로 결정했다.
기본적으로 블로그 포스팅은 MDX 를 통해 작성되며, 각 블로그는 독립된 앱처럼 보이게 구현하였다.
추후에는 WYSIWYG 에디터와 코드 에디터를 추가하여 블로그 작성을 더욱 편리하게 할 예정이다.
또 원래 하려고 했던 키보드 조작도 추가할 예정이다. (TBD)