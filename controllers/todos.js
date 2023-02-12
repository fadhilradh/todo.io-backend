const pool = require("../database");
const jwt = require("jsonwebtoken");
const { generateRandomID } = require("../utils");

function getTodoByUserId(req, response) {
  const token = req.cookies.jwt;
  jwt.verify(token, `${process.env.JWT_SECRET}`, (err, decodedToken) => {
    if (err) {
      return response
        .status(400)
        .send({ message: "Error when getting todo data" });
    } else {
      const { id } = decodedToken;
      pool
        .query(
          `SELECT task AS "title", is_done AS "completed", hash_id AS "id" FROM todo WHERE user_id = $1;`,
          [id]
        )
        .then((res) => response.json({ todos: res.rows }))
        .catch((err) => {
          console.log(err.stack);
          response.status(400).json({ message: err.stack });
        });
    }
  });
}

function postTodo(req, response) {
  const { task, isDone, userId } = req.body;
  const query = {
    text: "INSERT INTO todo (task, is_done, user_id, hash_id) VALUES ($1, $2, $3, $4) RETURNING *",
    values: [task, isDone, userId, generateRandomID()],
  };

  pool
    .query(query)
    .then((res) => response.json({ todo: res.rows[0] }))
    .catch((err) => {
      console.log(err.stack);
      response.status(400).json({ message: err.stack });
    });
}

function deleteTodo(req, res) {
  const { id } = req.params;
  const query = {
    text: "DELETE FROM todo WHERE hash_id = $1",
    values: [id],
  };

  pool
    .query(query)
    .then((result) => {
      res.json({ message: "Task deleted successfully" });
    })
    .catch((err) => {
      console.log(err.stack);
      res.status(400).json({ message: err.stack });
    });
}

function updateTodoStatus(req, res) {
  const { id } = req.params;
  const { isCompleted } = req.body;
  const query = {
    text: "UPDATE todo SET is_done = $1 WHERE hash_id = $2",
    values: [!isCompleted, id],
  };

  pool
    .query(query)
    .then((result) => {
      res.json({ message: "Task marked done successfully" });
    })
    .catch((err) => {
      console.log(err.stack);
      res.status(400).json({ message: err.stack });
    });
}

module.exports = { getTodoByUserId, postTodo, deleteTodo, updateTodoStatus };
