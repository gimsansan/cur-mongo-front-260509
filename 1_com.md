# Phase 1 진행 기록 (1단계 완료)

## 목표
Express 서버 기초를 단계별로 학습한다.
- 1단계: Express 서버 실행만 확인
- 2단계: GET/POST 라우팅
- 3단계: JSON 파싱(req.body)
- 4단계 이후: MongoDB, Mongoose, CRUD, MVC

---

## 오늘 수행한 작업

### 1) 프로젝트 초기화
- 명령어: `npm init -y`
- 결과: `package.json` 생성

### 2) 의존성 설치/정리
- 초기 설치:
  - `npm install express mongoose dotenv`
  - `npm install -D nodemon`
- 1단계 기준으로 정리:
  - `npm uninstall mongoose dotenv`
- 현재 기준:
  - dependencies: `express`
  - devDependencies: `nodemon`

### 3) 파일/폴더 구성
- 생성된 주요 구조:
  - `src/`
    - `app.js`
    - `server.js`
  - `.gitignore`
  - `package.json`
  - `package-lock.json`

### 4) 서버 실행 방식
- 권장 실행:
  - `npm run dev`
  - 또는 `node src/server.js`
- 주의:
  - `node server` / `node server.js`는 현재 구조에서 실패함
  - 이유: 파일이 루트가 아니라 `src/server.js`에 있음

### 5) 실행 확인 결과
- 콘솔 로그:
  - `Server is running on http://localhost:4000`
- 브라우저 확인:
  - `http://localhost:4000`
- 응답:
  - `{"message":"Express server is running"}`

---

## 학습 포인트

### app.js
- `express()`로 앱 생성
- `app.get("/", ...)`로 기본 라우트 구성
- `res.json()` 응답 방식
- `module.exports = app`로 앱/서버 역할 분리

### server.js
- `app` import
- `PORT` 환경값 또는 기본값 사용
- `app.listen()`으로 서버 시작

### package.json
- `scripts` (`dev`, `start`) 의미
- `dependencies` vs `devDependencies` 차이

### .gitignore
- `node_modules/`, `.env` 제외 이유

---

## 현재 상태
- 1단계 완료
- 다음 단계: 2단계(GET/POST 라우팅) 진행 예정