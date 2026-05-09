# 🚀 프론트엔드 개발자의 Node.js 백엔드 정복 커리큘럼

## 💻 학습자 환경 및 시스템 컨텍스트
- **백그라운드**: Vanilla React Native 기반 프론트엔드 개발자
- **개발 도구**: Cursor 에디터 (AI 기반 코드 작성 및 `.cursorrules` 활용에 익숙함)
- **하드웨어 조건**: 8GB RAM (메모리 병목 방지를 위해 무거운 로컬 서버 구동 시 주의 및 최적화 필수)

## 🎯 학습 핵심 철학 (점진적 확장)
> "처음에는 프론트엔드 JSON 문법과 똑같이 생겨서 아주 쉽게 접근할 수 있는 MongoDB로 '서버와 DB가 통신하는 맛'을 먼저 봅니다. 그다음, 진짜 백엔드의 정석이자 뼈대인 PostgreSQL로 넘어가서 '엄격하게 데이터를 다루는 법'을 익히게 됩니다."

---

## 📂 [Phase 1] 유연함으로 서버와 친해지기 (MongoDB + Node.js)
**목표**: 하드웨어 리소스를 최소화하며, 프론트엔드 지식을 활용해 백엔드 API 흐름을 빠르게 장악합니다.

* **1주차: Express.js 서버 기초**
  - Node.js 환경에서 Express 기본 라우팅(GET, POST, PUT, DELETE) 구성
  - 미들웨어 이해 및 클라이언트의 JSON 데이터 파싱 (`req.body`)
* **2주차: 클라우드 DB 연동 (MongoDB Atlas)**
  - 로컬 RAM 절약을 위한 클라우드 MongoDB 세팅
  - Mongoose ODM을 활용한 유연한 모델(Schema) 정의
* **3주차: RESTful API 완성 및 구조화**
  - CRUD(생성, 읽기, 수정, 삭제) 전체 로직 구현
  - 비즈니스 로직과 라우터 코드 분리 (MVC 패턴 기초)

---

## 📂 [Phase 2] 실무 표준 데이터 구조 및 인프라 통제 (PostgreSQL + Docker)
**목표**: 데이터의 무결성을 보장하는 관계형 DB 설계와, 로컬 Docker 인프라를 직접 통제하는 방법을 학습합니다.

* **4주차: 관계형 DB 기초 (PostgreSQL 클라우드)**
  - Neon Tech 등 서버리스 클라우드 DB 연결로 가볍게 시작
  - Prisma ORM을 도입하여 타입 안전성을 갖춘 테이블 생성
* **5주차: 데이터 관계(Relation) 설계**
  - 1:N (예: 유저-게시글), N:M 관계 데이터 모델링 및 마이그레이션 실습
* **6주차: Docker 도입 및 시스템 최적화**
  - 8GB RAM 제약 극복을 위한 `.wslconfig` 메모리 제한 설정
  - Docker 컨테이너, 이미지, 포트 포워딩 핵심 개념 학습
* **7주차: 로컬 DB 컨테이너화 (docker-compose)**
  - `docker-compose`를 이용해 클라우드가 아닌 로컬에 PostgreSQL 컨테이너 구동
  - 볼륨(Volume) 마운트를 통한 데이터 영구 보존(Persistence) 설정
* **8주차: 인증(Auth) 및 앱(React Native) 통신 연동**
  - Bcrypt 암호화 및 JWT(JSON Web Token) 기반 인증 미들웨어 구현
  - 완성된 로컬 백엔드를 작업 중인 React Native 앱과 직접 연결하여 풀스택 동작 확인

---
**지시사항(System Prompt):**
위의 맥락과 커리큘럼을 완벽히 숙지하십시오. 앞으로 나의 질문이나 실습 요청은 이 계획을 기반으로 진행됩니다. 답변은 항상 나의 하드웨어 환경(8GB RAM)과 기존 프론트엔드 지식을 고려하여 실용적이고 직관적인 코드로 제공해 주십시오.