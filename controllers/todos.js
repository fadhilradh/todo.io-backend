const pool = require("../database");

function getAllTodos(req, response) {
  pool
    .query(`SELECT task AS "title", is_done AS "completed" FROM todo;`)
    .then((res) => response.json({ todos: res.rows }))
    .catch((err) => {
      console.log(err.stack);
      response.status(400).json({ message: err.stack });
    });
}

function postTodo(req, response) {
  const { task, isDone } = req.body;
  const query = {
    text: "INSERT INTO todo (task, is_done) VALUES ($1, $2) RETURNING *",
    values: [task, isDone],
  };

  pool
    .query(query)
    .then((res) => response.json({ todo: res.rows[0] }))
    .catch((err) => {
      console.log(err.stack);
      response.status(400).json({ message: err.stack });
    });
}

module.exports = { getAllTodos, postTodo };
