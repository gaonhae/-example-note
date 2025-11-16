# Supabase 데이터베이스 설정 가이드

## 1. Supabase 프로젝트 생성

1. [https://app.supabase.com](https://app.supabase.com)에 접속하여 로그인
2. "New Project" 클릭
3. 프로젝트 이름, 데이터베이스 비밀번호 설정
4. Region 선택 (Northeast Asia (Seoul) 권장)
5. "Create new project" 클릭

## 2. 데이터베이스 테이블 생성

### SQL Editor에서 아래 쿼리 실행:

1. 좌측 메뉴에서 "SQL Editor" 클릭
2. "New query" 클릭
3. 아래 SQL 쿼리를 복사하여 붙여넣기
4. "Run" 버튼 클릭

```sql
-- posts 테이블 생성
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- 생성일 기준 인덱스 추가 (성능 최적화)
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);

-- Row Level Security (RLS) 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 게시글을 읽을 수 있도록 정책 생성
CREATE POLICY "게시글 읽기 허용"
  ON posts FOR SELECT
  USING (true);

-- 모든 사용자가 게시글을 작성할 수 있도록 정책 생성
CREATE POLICY "게시글 작성 허용"
  ON posts FOR INSERT
  WITH CHECK (true);

-- 모든 사용자가 게시글을 수정할 수 있도록 정책 생성
CREATE POLICY "게시글 수정 허용"
  ON posts FOR UPDATE
  USING (true);

-- 모든 사용자가 게시글을 삭제할 수 있도록 정책 생성
CREATE POLICY "게시글 삭제 허용"
  ON posts FOR DELETE
  USING (true);
```

## 3. API 키 확인 및 설정

1. 좌측 메뉴에서 "Settings" > "API" 클릭
2. "Project URL"과 "anon public" 키 확인
3. 프로젝트 루트의 `.env.local` 파일에 다음 정보 입력:

```env
NEXT_PUBLIC_SUPABASE_URL=여기에_Project_URL_입력
NEXT_PUBLIC_SUPABASE_ANON_KEY=여기에_anon_public_키_입력
```

## 4. 테이블 구조

### posts 테이블

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | BIGSERIAL | 게시글 고유 ID (자동 증가) |
| title | TEXT | 게시글 제목 |
| content | TEXT | 게시글 내용 |
| author | TEXT | 작성자 (익명 닉네임) |
| password | TEXT | 수정/삭제용 비밀번호 |
| created_at | TIMESTAMP | 생성 일시 (자동 설정) |
| updated_at | TIMESTAMP | 수정 일시 |

## 5. 보안 참고사항

⚠️ **주의**: 현재 구현에서는 비밀번호가 평문으로 저장됩니다. 프로덕션 환경에서는 다음 개선이 필요합니다:

1. **비밀번호 해싱**: bcrypt 등을 사용한 비밀번호 암호화
2. **서버 사이드 검증**: API Routes를 통한 비밀번호 검증
3. **Rate Limiting**: 무차별 대입 공격 방지

### 개선된 비밀번호 처리 예시 (선택사항):

프로덕션 환경에서는 `app/api/posts` 경로에 API 라우트를 만들어 서버 사이드에서 비밀번호를 검증하는 것이 좋습니다.

## 6. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 7. 기능 확인

- ✅ 게시글 목록 조회
- ✅ 게시글 작성
- ✅ 게시글 상세 보기
- ✅ 게시글 수정 (비밀번호 확인)
- ✅ 게시글 삭제 (비밀번호 확인)

## 8. Vercel 배포

1. GitHub 리포지토리에 코드 푸시
2. [https://vercel.com](https://vercel.com)에서 로그인
3. "Import Project" 클릭
4. GitHub 리포지토리 선택
5. 환경 변수 설정:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. "Deploy" 클릭

## 문제 해결

### 게시글이 표시되지 않는 경우
- Supabase 프로젝트 URL과 API 키가 올바른지 확인
- `.env.local` 파일이 제대로 설정되었는지 확인
- 개발 서버를 재시작 (`Ctrl+C` 후 `npm run dev`)

### RLS 정책 오류
- SQL Editor에서 정책이 제대로 생성되었는지 확인
- Table Editor에서 RLS가 활성화되어 있는지 확인
