const pool = require("../database");
const { generateRandomID } = require("../utils");

function getAllUsers(req, response) {
  const query = { text: "SELECT * FROM users" };
  pool
    .query(query)
    .then((res) => response.json({ users: res.rows }))
    .catch((err) => console.log(err.stack));
}

const createUser = (req, response) => {
  const { username, password, role = "user" } = req.body;
  const query = {
    text: "INSERT INTO users (id, username, password, role, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    values: [generateRandomID(), username, password, role, new Date()],
  };
  pool
    .query(query)
    .then((res) => {
      response.json({ user: res.rows[0] });
    })
    .catch((err) => {
      console.log(err.stack);
    });
};

module.exports = { getAllUsers, createUser };
