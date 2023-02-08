const pool = require("../../database/index.js");
const express = require("express");
const router = express.Router();

const BASE_PATH = "/todos";

router.get(BASE_PATH, (req, response) => {
  pool
    .query("SELECT * FROM todos;")
    .then((res) => response.json({ todos: res.rows }))
    .catch((err) => {
      console.log(err.stack);
      response.status(400).json({ message: err.stack });
    });
});

router.post(BASE_PATH, (req, response) => {
  const { task, isDone } = req.body;
  const query = {
    text: "INSERT INTO todos (task, isDone) VALUES ($1, $2) RETURNING *",
    values: [task, isDone],
  };
  pool
    .query(query)
    .then((res) => response.json({ todo: res.rows[0] }))
    .catch((err) => {
      console.log(err.stack);
      response.status(400).json({ message: err.stack });
    });
});

module.exports = router;
