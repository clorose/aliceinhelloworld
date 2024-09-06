# Node.js 기반 테크 블로그 & 포트폴리오

## 면책 조항

이 내용은 ai 기반으로 생성되었습니다. 현재 작업 중이며, 내용이 변경될 수 있습니다.

이 프로젝트는 Node.js와 React를 사용하여 구축된 개인 테크 블로그 및 포트폴리오 웹사이트입니다.
OS 특히 Ubuntu의 디자인을 차용하여 디자인을 구성하였습니다. (respect to Ubuntu)
제가 사용할 수 있는 기술 스택을 연습, 적용하고, 개인 블로그 및 포트폴리오를 구축하는 것을 목표로 합니다.
만약 이 라이브러리 그렇게 쓰는거 아닌데? 아니면 이 코드가 더 좋은데? 등의 피드백은 항상 감사합니다.
또 이 프로젝트를 사용하여 자신의 블로그 및 포트폴리오를 구축하고 싶으시다면, 이 프로젝트를 포크하여 사용하셔도 됩니다.

## 주요 기능

- 📝 마크다운 기반의 블로그 포스팅
- 🏷️ 카테고리 및 태그 시스템
- 🖼️ 포트폴리오 프로젝트 쇼케이스
- 🌓 다크 모드 지원
- 🔍 풀텍스트 검색 기능
- 📱 반응형 디자인(OS Concept의 디자인)

## OS 테마 기반 특징

이 프로젝트는 운영 체제(OS) 스타일의 사용자 인터페이스를 제공하여 독특하고 몰입감 있는 사용자 경험을 제공합니다. 주요 특징은 다음과 같습니다:

1. OS 스타일 UI 컴포넌트
2. 가상 파일 시스템
3. 애플리케이션 개념
4. 시스템 트레이
5. 터미널 에뮬레이터
6. 사용자 인증
7. 테마 및 커스터마이제이션
8. 반응형 디자인
9. 애니메이션 및 트랜지션
10. 접근성
11. SEO 최적화
12. 성능 최적화
13. 오프라인 지원
14. 데이터 시각화
15. 다국어 지원

<details>
<summary>URL 구조</summary>

각 "앱"의 URL은 실제 OS의 애플리케이션처럼 구성되어 있습니다:

- 홈: yourdomain.com
- 블로그: yourdomain.com/apps/blog
- 포트폴리오: yourdomain.com/apps/portfolio
- 설정: yourdomain.com/apps/settings
- 터미널: yourdomain.com/apps/terminal

이러한 구조를 통해 사용자에게 실제 OS를 사용하는 듯한 경험을 제공합니다.
</details>

<details>
<summary>기술 스택</summary>

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

### 개발 도구
- **Storybook**: UI 컴포넌트 개발 및 테스트 환경

### 배포
- **Vercel**: Next.js 애플리케이션 호스팅 및 배포 플랫폼

</details>

<details>
<summary>추가(할) 라이브러리 및 기술</summary>

### UI/UX 향상
- **@radix-ui/react-tooltip**: 접근성 높은 툴팁 컴포넌트 라이브러리
- **next-themes**: Next.js용 테마 관리 라이브러리

### 코드 구문 강조
- **prism-react-renderer**: React에 최적화된 구문 강조 라이브러리

### 개발 도구
- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포맷팅
- **Husky**: Git hooks 관리
- **lint-staged**: 스테이징된 파일에 대한 린팅

### 분석 및 모니터링
- **Google Analytics**: 웹사이트 분석

### 소셜 기능
- **utterances**: GitHub 이슈 기반 댓글 시스템

### 보안
- **helmet**: Express 앱을 위한 보안 HTTP 헤더 설정
- **csurf**: CSRF 보호 미들웨어

### 성능 최적화
- **compression**: Node.js 압축 미들웨어
- **next-pwa**: Progressive Web App (PWA) 지원

### 문서화
- **Swagger-UI-Express**: API 문서화

</details>

<details>
<summary>시작하기</summary>

### 필수 조건

- Node.js 14.0.0 이상
- yarn
- MongoDB (로컬 또는 Atlas)
- PostgreSQL

### 설치

1. 저장소를 클론합니다:
   ```
   git clone https://github.com/yourusername/tech-blog-portfolio.git
   ```

2. 프로젝트 디렉토리로 이동합니다:
   ```
   cd tech-blog-portfolio
   ```

3. 의존성을 설치합니다:
   ```
   yarn install
   ```

4. 환경 변수를 설정합니다:
   ```
   cp .env.example .env.local
   ```
   `.env.local` 파일을 열고 필요한 환경 변수를 설정합니다.

5. 데이터베이스 설정:
   - MongoDB: `MONGODB_URI` 환경 변수에 연결 문자열을 설정합니다.
   - PostgreSQL: `POSTGRES_URL` 환경 변수에 연결 정보를 설정합니다.

6. 개발 서버를 실행합니다:
   ```
   yarn dev
   ```

이제 브라우저에서 `http://localhost:3000`으로 접속하여 애플리케이션을 확인할 수 있습니다.
</details>

<details>
<summary>배포</summary>

이 프로젝트는 Vercel에 배포하도록 설정되어 있습니다.

1. [Vercel](https://vercel.com/)에 가입하고 GitHub 계정을 연동합니다.
2. 새 프로젝트를 생성하고 이 저장소를 선택합니다.
3. 환경 변수를 Vercel 프로젝트 설정에 추가합니다.
4. 배포 설정을 검토하고 "Deploy" 버튼을 클릭합니다.

main 브랜치에 push하면 자동으로 배포가 진행됩니다.
</details>

<details>
<summary>기여하기</summary>

프로젝트에 기여하고 싶으시다면 다음 단계를 따라주세요:

1. 이 저장소를 포크합니다.
2. 새 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`).
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`).
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`).
5. Pull Request를 생성합니다.

### 코드 스타일 가이드

- ESLint와 Prettier 설정을 따릅니다.
- 함수형 컴포넌트와 Hooks를 사용합니다.
- 컴포넌트 이름은 PascalCase로 작성합니다.
- 변수와 함수 이름은 camelCase로 작성합니다.

### 커밋 메시지 규칙

커밋 메시지는 다음 형식을 따릅니다:
```
type: Subject

body (optional)

footer (optional)
```

- type: feat, fix, docs, style, refactor, test, chore 중 하나
- Subject: 50자 이내, 현재 시제로 작성
- body: 어떻게 보다는 무엇을, 왜 변경했는지 설명 (선택사항)
- footer: 관련 이슈 번호 (선택사항)

예: `feat: Add dark mode toggle button`
</details>

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 연락처

프로젝트 관리자 - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

프로젝트 링크: [https://github.com/yourusername/tech-blog-portfolio](https://github.com/yourusername/tech-blog-portfolio)