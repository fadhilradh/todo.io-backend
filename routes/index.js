const { verifyAdminToken, verifyUserToken } = require("../middleware/auth.js");
const {
  getAllUsers,
  createUser,
  getUserById,
  editUserProfilePic,
  editUserData,
} = require("../controllers/users.js");
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
const getSSLFile = require("../controllers/ssl.js");
const { getS3Url } = require("../controllers/s3url.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ mesage: "Welcome to todo backend !" });
});

const TODO_BASE_PATH = "/todos";
router.get(TODO_BASE_PATH, verifyUserToken, getTodoByUserId);
router.post(TODO_BASE_PATH, verifyUserToken, postTodo);
router.delete(`${TODO_BASE_PATH}/:id`, verifyUserToken, deleteTodo);
router.patch(`${TODO_BASE_PATH}/:id`, verifyUserToken, updateTodoStatus);
router.patch(`${TODO_BASE_PATH}/title/:id`, verifyUserToken, updateTodoTitle);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

const USER_BASE_PATH = "/user";
router.get(USER_BASE_PATH, verifyAdminToken, getAllUsers);
router.get(`${USER_BASE_PATH}/:id`, verifyUserToken, getUserById);
router.post(USER_BASE_PATH, verifyAdminToken, createUser);
router.put(`${USER_BASE_PATH}/:userId`, verifyUserToken, editUserData);
router.put(
  `${USER_BASE_PATH}/profile-pic/:userId`,
  verifyUserToken,
  editUserProfilePic
);

router.get("/s3url", verifyUserToken, getS3Url);

router.get(
  "/.well-known/pki-validation/F4B98923733B57B85171547E51F4E007.txt",
  getSSLFile
);

module.exports = router;
