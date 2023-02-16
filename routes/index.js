const { verifyAdminToken } = require("../middleware/auth.js");
const { getAllUsers, createUser } = require("../controllers/users.js");
const express = require("express");
const {
  getTodoByUserId,
  postTodo,
  deleteTodo,
  updateTodoStatus,
  updateTodoTitle,
} = require("../controllers/todos.js");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/auth.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ mesage: "Welcome to todo BE !" });
});

const TODO_BASE_PATH = "/todos";
router.get(TODO_BASE_PATH, getTodoByUserId);
router.post(TODO_BASE_PATH, postTodo);
router.delete(`${TODO_BASE_PATH}/:id`, deleteTodo);
router.patch(`${TODO_BASE_PATH}/:id`, updateTodoStatus);
router.patch(`${TODO_BASE_PATH}/title/:id`, updateTodoTitle);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

const USER_BASE_PATH = "/user";
router.get(USER_BASE_PATH, verifyAdminToken, getAllUsers);
router.post(USER_BASE_PATH, verifyAdminToken, createUser);

module.exports = router;
