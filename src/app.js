const express = require("express");

const app = express();
app.use(express.json());
app.set('json spaces', 2);
const tasks = [
  { id: 1, title: "Learn Express routing" },
  { id: 2, title: "Test GET and POST endpoints" },
];

function sendBadRequest(res, message) {
  return res.status(400).json({
    message: "Bad Request",
    error: message,
  });
}

function sendNotFound(res, message) {
  return res.status(404).json({
    message: "Not Found",
    error: message,
  });
}

function nextTaskId() {
  const maxId = tasks.reduce((max, task) => Math.max(max, task.id), 0);
  return maxId + 1;
}

app.get("/", (req, res) => {
  res.json({
    message: "Express server is running",
  });
});

app.get("/api/tasks", (req, res) => {
  const {title} = req.query;

  res.status(200).json({
    message: "GET /api/tasks success",
    data: tasks,
    title: title,
  });
});

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

app.post("/api/tasks", (req, res) => {
  const { title } = req.body || {};

  if (title === undefined) {
    return sendBadRequest(res, "title is required");
  }

  if (typeof title !== "string") {
    return sendBadRequest(res, "title must be a string");
  }

  const normalizedTitle = title.trim();//공백제거

  if (normalizedTitle.length < 1 || normalizedTitle.length > 100) { // 제목 길이 검증 100자 이하 1자 이상 
    return sendBadRequest(res, "title length must be between 1 and 100");
  }

  const newTask = { id: nextTaskId(), title: normalizedTitle };
  tasks.push(newTask);

  res.status(201).json({
    message: "POST /api/tasks success",
    data: newTask,
  });
});

module.exports = app;