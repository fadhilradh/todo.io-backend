const pool = require("../database/index.js");
const express = require("express");
const {
  getTodoByUserId,
  postTodo,
  deleteTodo,
} = require("../controllers/todos.js");
const { getAllUsers, createUser } = require("../controllers/users.js");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.js");
const { adminAuth } = require("../middleware/auth.js");
const router = express.Router();

const TODO_BASE_PATH = "/todos";
router.get(TODO_BASE_PATH, getTodoByUserId);
router.post(TODO_BASE_PATH, postTodo);
router.delete(`${TODO_BASE_PATH}/:id`, deleteTodo);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

const USER_BASE_PATH = "/user";
router.get(USER_BASE_PATH, adminAuth, getAllUsers);
router.post(USER_BASE_PATH, adminAuth, createUser);

module.exports = router;
