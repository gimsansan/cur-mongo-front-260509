# `parseTaskId` + `findTaskById` 최소 diff 리팩토링안

대상 파일: `src/app.js`  
목표: GET/PUT/DELETE에 세 번 반복되는 **`:id` 파싱 + NaN 가드**와 **`tasks.find`로 단건 조회**를 `validateTitle`과 같은 결의 헬퍼로 모은다. **라우트 URL·응답 형태는 그대로** 유지한다.

---

## 1. 적용 순서 (라우트 변경 최소화)

| 순서 | 작업 | 이유 |
|------|------|------|
| 1 | `sendNotFound` 아래(또는 `validateTitle` 위)에 **`parseTaskId`**, **`findTaskById`** 두 함수만 추가 | 기존 라우트는 아직 건드리지 않아 중간 커밋도 가능 |
| 2 | `app.get("/api/tasks/:id", ...)` 내부만 치환 | 한 군데만 바꿔서 동작 확인 |
| 3 | `app.put("/api/tasks/:id", ...)` 내부만 치환 | GET과 동일 패턴 |
| 4 | `app.delete("/api/tasks/:id", ...)` 내부만 치환 | `splice`용 인덱스는 아래 “DELETE” 절 참고 |

POST·`GET /`·`GET /api/tasks`·헬퍼 시그니처(`sendBadRequest` 등)는 **변경하지 않음**.

---

## 2. 추가할 코드 (`validateTitle` 앞에 두는 예시)

`sendNotFound`와 `nextTaskId` 사이(대략 24줄 직후)에 삽입한다.

```js
function parseTaskId(req) {
  const idNum = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(idNum)) {
    return null;
  }
  return idNum;
}

function findTaskById(idNum) {
  return tasks.find((t) => t.id === idNum);
}
```

### 계약(의도)

| 함수 | 인자 | 반환 | 의미 |
|------|------|------|------|
| `parseTaskId` | `req` | `number \| null` | `null`이면 URL의 `:id`가 유효한 10진 정수로 해석되지 않음(기존과 동일하게 404로 처리) |
| `findTaskById` | `idNum` | `object \| undefined` | 기존 `tasks.find((t) => t.id === idNum)`과 동일 |

`validateTitle`처럼 `{ error }` 객체를 쓰지 않고 **단순 값**으로 둔 이유: 라우트에서 이미 `return sendNotFound(...)` 패턴이 고정되어 있어, **`null` / `undefined`만으로 분기**하면 라우트 diff가 최소가 된다.

---

## 3. 라우트별 패치 예시

### 3.1 `GET /api/tasks/:id`

**Before**

```js
app.get("/api/tasks/:id", (req, res) => {
  const idNum = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(idNum)) {
    return sendNotFound(res, "Task not found");
  }

  const task = tasks.find((t) => t.id === idNum);
  if (!task) {
    return sendNotFound(res, "Task not found");
  }

  res.status(200).json({
    message: "GET /api/tasks/:id success",
    data: task,
  });
});
```

**After**

```js
app.get("/api/tasks/:id", (req, res) => {
  const idNum = parseTaskId(req);
  if (idNum === null) {
    return sendNotFound(res, "Task not found");
  }

  const task = findTaskById(idNum);
  if (!task) {
    return sendNotFound(res, "Task not found");
  }

  res.status(200).json({
    message: "GET /api/tasks/:id success",
    data: task,
  });
});
```

---

### 3.2 `PUT /api/tasks/:id`

**Before** (id + find 블록만 발췌)

```js
  const idNum = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(idNum)) {
    return sendNotFound(res, "Task not found");
  }

  const task = tasks.find((t) => t.id === idNum);
  if (!task) {
    return sendNotFound(res, "Task not found");
  }
```

**After**

```js
  const idNum = parseTaskId(req);
  if (idNum === null) {
    return sendNotFound(res, "Task not found");
  }

  const task = findTaskById(idNum);
  if (!task) {
    return sendNotFound(res, "Task not found");
  }
```

나머지(`req.body`, `validateTitle`, `task.title` 할당, `res.status(200)...`)는 **그대로**.

---

### 3.3 `DELETE /api/tasks/:id` (헬퍼 두 개만 쓰는 최소안)

`findTaskById`는 **요소**만 돌려주므로 `splice`에는 **인덱스**가 필요하다. 헬퍼를 두 개로 제한하면 관례적으로 `indexOf`로 인덱스를 구한다.

**Before**

```js
app.delete("/api/tasks/:id", (req, res) => {
  const idNum = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(idNum)) {
    return sendNotFound(res, "Task not found");
  }

  const idx = tasks.findIndex((t) => t.id === idNum);
  if (idx === -1) {
    return sendNotFound(res, "Task not found");
  }

  const [removed] = tasks.splice(idx, 1);

  res.status(200).json({
    message: "DELETE /api/tasks/:id success",
    data: removed,
  });
});
```

**After**

```js
app.delete("/api/tasks/:id", (req, res) => {
  const idNum = parseTaskId(req);
  if (idNum === null) {
    return sendNotFound(res, "Task not found");
  }

  const task = findTaskById(idNum);
  if (!task) {
    return sendNotFound(res, "Task not found");
  }

  const idx = tasks.indexOf(task);
  const [removed] = tasks.splice(idx, 1);

  res.status(200).json({
    message: "DELETE /api/tasks/:id success",
    data: removed,
  });
});
```

동작은 기존과 동일하게, `task`가 없으면 404, 있으면 그 참조의 인덱스를 `indexOf`로 구해 `splice`한다.

---

## 4. 성능 메모 (부정적 영향 가능성)

| 구간 | 기존 | 이 패치 후 |
|------|------|------------|
| GET / PUT | `find` 1회(O(n)) | `find` 1회 — **실질 동일** |
| DELETE | `findIndex` 1회(O(n)) | `find` 1회 + `indexOf` 1회 — 최악 **배열을 두 번 훑음** |

`tasks`가 매우 큰 경우 DELETE만 미세하게 불리할 수 있다. 그때는 **세 번째 헬퍼** `findTaskIndexById(idNum)`로 `findIndex` 한 번으로 되돌리거나, `findTaskById`가 `{ task, index }`를 반환하도록 확장하는 식으로 최적화하면 된다. (이 문서 범위는 “두 헬퍼만”이므로 선택 사항으로 남긴다.)

---

## 5. 확장은 하지 않은 것 (의도적 범위 밖)

- `"12abc"`처럼 `parseInt`가 앞부분만 먹는 입력을 **전부 거절**하는 엄격 파싱(정규식 등) — 원하면 `parseTaskId` 한곳만 바꾸면 된다.
- POST/PUT의 `validateTitle` 중복 제거 — 별도 리팩토링.
- `parseTaskId`에 `res`를 넘겨 `sendNotFound`까지 호출하는 스타일 — 라우트는 짧아지지만 **응답을 보내는 헬퍼**가 늘어 테스트·재사용 경계가 달라져, 이번 “최소 diff”에서는 제외했다.

---

## 6. 검증 체크리스트

- `GET /api/tasks/1` → 200, `data` 동일  
- `GET /api/tasks/abc` → 404  
- `GET /api/tasks/999` → 404  
- `PUT` / `DELETE`도 위와 동일  
- `DELETE` 후 배열 길이·남은 id — 기존과 동일  

프로젝트에 테스트 스크립트가 있으면 해당 명령을 한 번 돌리면 된다.
