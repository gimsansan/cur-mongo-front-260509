const express = require("express");

const app = express();
const tasks = [
  { id: 1, title: "Learn Express routing" },
  { id: 2, title: "Test GET and POST endpoints" },
];

app.get("/", (req, res) => {
  res.json({
    message: "Express server is running",
  });
});

app.get("/api/tasks", (req, res) => {
  res.status(200).json({
    message: "GET /api/tasks success",
    data: tasks,
  });
});

app.post("/api/tasks", (req, res) => {
  res.status(201).json({
    message: "POST /api/tasks success",
    note: "Request body parsing will be added in step 3.",
  });
});

module.exports = app;
