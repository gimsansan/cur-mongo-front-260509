# 나중에 해도 되는 선택적 리팩터 (학습·주차 목표와 무관)

`schedule.md` **2주차**(MongoDB Atlas + Mongoose)나 **DB 전환**을 할 때 **반드시 같이 할 필요는 없는** 정리 작업을 여기에 모아 둡니다. 시간이 남거나 코드가 헷갈릴 때 진행하면 됩니다.

---

## 결론 한 줄

**`parseTaskId` / `findTaskById`**, **`req.body` + `validateTitle` + 400 한 헬퍼** 같은 건 **안 해도 주차 목표나 DB 붙이기에 지장 없음**. 원할 때 적용.

---

## 1. `:id` 파싱·조회 중복 줄이기

- **문서:** [`refactor-parseTaskId-findTaskById.md`](./refactor-parseTaskId-findTaskById.md)  
- **내용:** `Number.parseInt` + `Number.isNaN` + `tasks.find` / DELETE용 인덱스 처리 등을 헬퍼로 모음.  
- **언제:** 메모리 배열 CRUD든 Mongo CRUD든 **라우트가 비슷한 패턴으로 남아 있을 때** 어느 시점에나 가능.  
- **주의:** 문서의 DELETE 예시는 `find` + `indexOf`로 **배열을 두 번 도는** 선택이 있음 → task가 매우 많으면 `findIndex` 한 번 등으로 바꿀 수 있음(같은 문서에 성능 메모 있음).

---

## 2. POST·PUT — body 읽기 + 검증 + 400 한 덩어리로 묶기

- **문서:** [`refactor-readBody-validateTitle.md`](./refactor-readBody-validateTitle.md)  
- **내용:** `const { title } = req.body || {}` → `validateTitle` → `sendBadRequest` 반복을 함수로 통합(방향 A/B 설명 있음).  
- **언제:** POST/PUT이 여전히 두 군데에 있을 때 아무 때나. **Mongo 전환 후**에 해도 됨.

---

## 3. 이미 된 것 (중복 작업 방지)

- **`validateTitle(title)`** 자체는 **이미** `src/app.js`에 있고 POST·PUT이 공유함.  
  → “검증 규칙” 추출은 완료. 위 2번은 **그 바깥 줄**만 더 묶는 선택지.

---

## 4. DB 전환과의 관계

| 작업 종류 | 2주차 필수와의 관계 |
|-----------|---------------------|
| Atlas, `mongoose.connect`, 스키마, CRUD를 DB로 | **필수 축** |
| 메모리 `tasks` 제거, 연결 모듈 분리, CastError → 404 등 | **전환에 딸린 정리** — 하면 좋음 |
| 이 문서의 순수 리팩터(1·2) | **선택** — 나중에 OK |

---

## 5. 커밋 메시지 예시 (나중에 적용할 때)

- `refactor(tasks): extract parseTaskId and findTaskById helpers`  
- `refactor(tasks): centralize POST/PUT title read and validation`

---

이 파일은 **“나중에 할 일 메모”**용이며, 내용 적용 여부와 시기는 전적으로 본인 스케줄에 맡깁니다.