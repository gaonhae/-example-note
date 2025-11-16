# 익명 게시판

Next.js, Supabase, Vercel을 활용한 간단한 익명 게시판 애플리케이션입니다.

## 기능

- ✅ 게시글 목록 조회
- ✅ 게시글 작성
- ✅ 게시글 상세 보기
- ✅ 게시글 수정 (비밀번호 인증)
- ✅ 게시글 삭제 (비밀번호 인증)

## 기술 스택

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 프로젝트 구조

```
note/
├── app/
│   ├── posts/
│   │   ├── new/
│   │   │   └── page.tsx         # 게시글 작성 페이지
│   │   └── [id]/
│   │       └── page.tsx         # 게시글 상세/수정/삭제 페이지
│   ├── globals.css              # 전역 스타일
│   ├── layout.tsx               # 루트 레이아웃
│   └── page.tsx                 # 메인 페이지 (게시글 목록)
├── lib/
│   └── supabase.ts              # Supabase 클라이언트 설정
├── .env.local                   # 환경 변수 (git에 포함되지 않음)
├── .env.example                 # 환경 변수 예시
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── postcss.config.js
├── SUPABASE_SETUP.md           # Supabase 설정 가이드
└── README.md
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. Supabase 설정

`SUPABASE_SETUP.md` 파일을 참고하여 Supabase 프로젝트를 생성하고 데이터베이스를 설정하세요.

### 3. 환경 변수 설정

`.env.local` 파일에 Supabase 정보를 입력하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 빌드 및 배포

### 로컬 빌드

```bash
npm run build
npm start
```

### Vercel 배포

1. GitHub에 코드를 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 임포트
3. 환경 변수 설정 (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
4. 배포

## 주요 페이지

- `/` - 게시글 목록
- `/posts/new` - 새 게시글 작성
- `/posts/[id]` - 게시글 상세 보기/수정/삭제

## 보안 고려사항

⚠️ 이 프로젝트는 학습 목적으로 만들어졌습니다. 프로덕션 환경에서는 다음 개선이 필요합니다:

1. **비밀번호 암호화**: 현재 평문으로 저장되는 비밀번호를 bcrypt 등으로 해싱
2. **서버 사이드 검증**: API Routes를 통한 비밀번호 검증
3. **Rate Limiting**: 무차별 대입 공격 방지
4. **입력 검증 및 sanitization**: XSS 공격 방지

## 라이선스

MIT
