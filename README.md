# Multi-Blog OS: Node.js 기반 멀티 블로그 & 포트폴리오

## 면책 조항

이 내용은 ai 기반으로 생성되었습니다. 현재 작업 중이며, 내용이 변경될 수 있습니다.

## 프로젝트 소개

이 프로젝트는 Node.js와 React를 사용하여 구축된 OS 스타일의 멀티 블로그 & 포트폴리오 웹사이트입니다.
Ubuntu의 디자인에서 영감을 받아 OS 스타일의 인터페이스를 구현하였으며, 각각의 블로그를 독립된 애플리케이션처럼 제공합니다.
Git 기반의 자동 컨텐츠 관리 시스템을 통해 편리한 블로그 관리가 가능합니다.

## 주요 기능

### 멀티 블로그 시스템
- 📚 각 블로그를 독립된 앱으로 운영
- 📝 블로그별 특화된 에디터 제공 (마크다운/WYSIWYG)
- 🏷️ 블로그별 독립 카테고리 및 태그 시스템
- 🔄 Git 기반 자동 콘텐츠 관리

### OS 스타일 인터페이스
- 🖥️ 데스크탑 환경의 멀티태스킹
- 📂 통합 파일 시스템
- ⌨️ Vim 스타일 키보드 내비게이션
- 💻 터미널 기반 고급 제어
- 🌓 다크 모드 지원
- 🔍 통합 검색 기능
- 📱 반응형 디자인

## 시스템 구조

### 프로젝트 구조
```
src/
├── app/              # Next.js App Router 구조
│   ├── admin/        # 관리자 인터페이스
│   ├── api/         # API 엔드포인트
│   ├── apps/        # 각종 앱들
│   └── (os)/       # OS 인터페이스
├── components/      # React 컴포넌트
│   ├── apps/       # 앱별 컴포넌트
│   ├── os/         # OS 시스템 컴포넌트
│   └── shared/     # 공통 컴포넌트
├── hooks/          # 커스텀 훅
├── lib/           # 유틸리티 & 설정
├── styles/        # 글로벌 스타일
└── types/         # TypeScript 타입
```

### OS 구성요소
- Desktop: 앱 아이콘 및 기본 인터페이스
- Taskbar: 시작 메뉴, 실행 중인 앱, 시스템 트레이
- Window: 앱 윈도우 관리
- Menu: 컨텍스트 메뉴 시스템

### 애플리케이션
현재 구현된/구현 예정 앱:

#### 블로그 앱
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

※ 추가 블로그 앱은 향후 확장 예정

#### 시스템 앱
- **Files.app**: 통합 파일 시스템 관리
- **Portfolio.app**: 프로젝트 쇼케이스
- **Terminal.app**: 명령어 기반 관리
- **Settings.app**: 시스템 설정

### 파일 시스템 구조
```
/content
  /blogs
    /dev
      /posts
      /drafts
      /assets
    /trpg
      /posts
      /drafts
      /assets
  /portfolio
    /projects
    /assets
  /shared
    /templates
    /media
```

## 기술 스택

### 프레임워크 및 라이브러리
- **Node.js**: 서버 사이드 JavaScript 런타임
- **Express.js**: Node.js 웹 애플리케이션 프레임워크
- **React**: UI 구축을 위한 JavaScript 라이브러리
- **Next.js**: React 기반의 서버 사이드 렌더링(SSR) 지원 프레임워크
- **TypeScript**: 정적 타입 지원을 위한 JavaScript의 상위 집합

### 스타일링
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크

### 상태 관리 및 데이터 페칭
- **Zustand**: React 전역 상태 관리 라이브러리
- **SWR**: 데이터 페칭 및 캐싱을 위한 React Hooks 라이브러리
- **React Hook Form**: 폼 상태 관리 라이브러리

### 데이터 fetching
- **ky**: 가벼운 브라우저용 HTTP 클라이언트
- **got**: 강력한 Node.js용 HTTP 클라이언트

### 데이터베이스
- **MongoDB**: 문서 지향 NoSQL 데이터베이스
- **PostgreSQL**: 관계형 데이터베이스

### 인증
- **Passport.js**: Node.js를 위한 인증 미들웨어

### 콘텐츠 관리
- **MDX**: Markdown과 JSX를 혼합하여 사용 가능한 포맷

### 테스팅
- **Jest**: JavaScript 테스팅 프레임워크
- **React Testing Library**: React 컴포넌트 테스팅 라이브러리

### 유틸리티
- **date-fns**: 날짜 조작 및 포맷팅 라이브러리

### 배포
- **Vercel**: Next.js 애플리케이션 호스팅 및 배포 플랫폼

## 시작하기

### 필수 조건

- Node.js 14.0.0 이상
- pnpm 또는 yarn(선호에 따라 선택)
- MongoDB (로컬 또는 Atlas)
- PostgreSQL

### 설치

0. pnpm을 설치합니다:
   ```bash
   npm install -g pnpm
   ```

1. 저장소를 포크한 뒤 클론합니다:
   ```bash
   git clone https://github.com/yourusername/tech-blog-portfolio.git
   ```

2. 프로젝트 디렉토리로 이동합니다:
   ```bash
   cd tech-blog-portfolio
   ```

3. 의존성을 설치합니다:
   ```bash
   pnpm install
   ```

4. 환경 변수를 설정합니다:
   ```bash
   cp .env.example .env.local
   ```
   `.env.local` 파일을 열고 필요한 환경 변수를 설정합니다.

5. 데이터베이스 설정:
   - MongoDB: `MONGODB_URI` 환경 변수에 연결 문자열을 설정합니다.
   - PostgreSQL: `POSTGRES_URL` 환경 변수에 연결 정보를 설정합니다.

6. 개발 서버를 실행합니다:
   ```bash
   pnpm dev
   ```

이제 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인할 수 있습니다.

## 배포

이 프로젝트는 Vercel에 배포하도록 설정되어 있습니다.

1. [Vercel](https://vercel.com/)에 가입하고 GitHub 계정을 연동합니다.
2. 새 프로젝트를 생성하고 이 저장소를 선택합니다.
3. 환경 변수를 Vercel 프로젝트 설정에 추가합니다.
4. 배포 설정을 검토하고 "Deploy" 버튼을 클릭합니다.

main 브랜치에 push하면 자동으로 배포가 진행됩니다.

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 연락처

프로젝트 관리자 - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

프로젝트 링크: [https://github.com/yourusername/tech-blog-portfolio](https://github.com/yourusername/tech-blog-portfolio)

## 기여하기

1. 프로젝트를 포크합니다
2. 새로운 기능 브랜치를 만듭니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다