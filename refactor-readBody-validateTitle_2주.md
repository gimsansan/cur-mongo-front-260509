
다만 그 문서는 body 읽기 + validateTitle + 400 한 헬퍼 추출은 다루지 않습니다. 그건 같은 “작은 리팩터” 묶음 안의 다른 선택지라서, 그걸 하려면 md와는 별도로 추가 작업이 필요합니다.



다음 파일을 만들어 두었습니다.

**경로:** `d:\git_clone\cur-mongo-front-260509\refactor-readBody-validateTitle.md`

**들어 있는 내용 요약**

- POST(82~87)·PUT(109~114)에 겹치는 **body → `validateTitle` → 400** 흐름이 무엇인지  
- **방향 A**: `readTitleFromBody(req)`처럼 값만 묶고, 400은 라우트에서 그대로 처리  
- **방향 B**: `readNormalizedTitleOrBadRequest(req, res)`처럼 **400까지 한 함수**에서 처리하는 예시  
- 적용 순서, 성능, `parseTaskId` md와의 관계, 체크리스트  

`app.js`는 수정하지 않았고, 설명용 md만 추가했습니다.


--- 나중에 위 수정도 해보는 정도에서 확인할 내용들--






# `req.body`에서 title 읽기 + `validateTitle` + 400 응답 — 헬퍼 추출안 (요약)

대상 파일: `src/app.js`  
목적: **POST**와 **PUT**에 두 번 반복되는 아래 흐름을 한 함수로 모아, 수정 지점을 한곳으로 줄인다.  
성격: **선택 리팩터** — 동작을 바꾸기 위한 필수 작업은 아니다.

---

## 1. 지금 중복되는 코드가 무엇인가

`validateTitle` 자체는 이미 공통 함수(30~46줄)다. 중복은 **그 앞뒤 “껍데기”**다.

### POST (`POST /api/tasks`)

```81:87:d:\git_clone\cur-mongo-front-260509\src\app.js
app.post("/api/tasks", (req, res) => {
  const { title } = req.body || {};

  const { value: normalizedTitle, error } = validateTitle(title);
  if (error) {
    return sendBadRequest(res, error);
  }
```

### PUT (`PUT /api/tasks/:id`) — id·task 찾은 **뒤**에 동일 패턴

```109:114:d:\git_clone\cur-mongo-front-260509\src\app.js
  const { title } = req.body || {};

  const { value: normalizedTitle, error } = validateTitle(title);
  if (error) {
    return sendBadRequest(res, error);
  }
```

공통 패턴:

1. `req.body || {}`에서 `title` 꺼내기  
2. `validateTitle(title)` 호출  
3. `error`가 있으면 `sendBadRequest(res, error)` 후 **즉시 종료**

---

## 2. 추출 후 “대략” 어떻게 보이나

### 방향 A — **값만** 돌려주고, 400은 라우트가 보내기 (테스트하기 쉬움)

헬퍼는 **`res`를 모름**. `validateTitle`과 같은 결에 가깝다.

```js
function readTitleFromBody(req) {
  const { title } = req.body || {};
  return validateTitle(title);
}
```

라우트에서는:

```js
const { value: normalizedTitle, error } = readTitleFromBody(req);
if (error) {
  return sendBadRequest(res, error);
}
```

**효과**: `req.body || {}` 한 줄만 공통화된다. `if (error) return sendBadRequest`는 여전히 두 번.

---

### 방향 B — **읽기 + 검증 + 400까지** 한 함수 (질문에서 말한 “한 헬퍼”에 가장 가깝음)

헬퍼가 **`res`를 받고**, 실패 시 직접 `sendBadRequest`를 호출한다.

```js
function readNormalizedTitleOrBadRequest(req, res) {
  const { title } = req.body || {};
  const { value, error } = validateTitle(title);
  if (error) {
    sendBadRequest(res, error);
    return null;
  }
  return value;
}
```

라우트에서는:

```js
const normalizedTitle = readNormalizedTitleOrBadRequest(req, res);
if (normalizedTitle === null) {
  return;
}
```

**효과**: POST·PUT 모두 위 **3줄**로 통일 가능.  
**주의**: 헬퍼가 응답을내므로, 단위 테스트 시 `res` 목(mock)이 필요해질 수 있다.

---

## 3. 적용 순서 (최소 diff)

| 순서 | 작업 |
|------|------|
| 1 | `validateTitle` 바로 아래(또는 근처)에 헬퍼 **한 개** 추가 (방향 A 또는 B 중 택일) |
| 2 | `app.post("/api/tasks", ...)`에서 중복 블록을 헬퍼 호출로 치환 |
| 3 | `app.put("/api/tasks/:id", ...)`에서 동일 치환 |
| 4 | 수동으로 POST/PUT 각각 한 번 호출해 200 / 400 동작 확인 |

**PUT만의 차이**: id·task 조회는 그대로 두고, **`task`를 찾은 뒤**에만 위 헬퍼를 쓰면 된다. 순서를 바꾸지 않는다.

---

## 4. 성능·부작용

- **성능**: `req.body` 접근·`validateTitle` 한 번 — 기존과 동일. 추가 비용 없음.  
- **동작**: `validateTitle` 규칙을 바꾸지 않는 한 API 계약(상태 코드·JSON 형태)은 그대로 유지 가능.

---

## 5. 이 문서와 `refactor-parseTaskId-findTaskById.md`의 관계

| 문서 | 다루는 중복 |
|------|-------------|
| `refactor-parseTaskId-findTaskById.md` | `:id` 파싱 + `find` / DELETE 인덱스 |
| 이 문서 (`refactor-readBody-validateTitle.md`) | POST·PUT의 **body + title 검증 + 400** |

서로 독립이라 **어느 것만** 적용해도 되고, **둘 다** 적용해도 된다.

---

## 6. 검증 체크리스트

- `POST /api/tasks` — `title` 없음·타입 오류·길이 위반 → **400**, 본문 스키마 동일  
- `POST /api/tasks` — 정상 → **201**  
- `PUT /api/tasks/:id` — 존재하는 id + 잘못된 `title` → **400**  
- `PUT /api/tasks/:id` — 존재하는 id + 정상 `title` → **200**  

---

## 7. 요약 한 줄

**“`req.body`에서 title 꺼내고, `validateTitle` 돌리고, 틀리면 400 보내는 덩어리를 POST와 PUT이 같이 쓰는 함수로 빼는 것”**이며, 필수는 아니고 코드 정리용이다.
