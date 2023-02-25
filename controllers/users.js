const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_EXPIRATION } = require("../configs");
const pool = require("../database");
const { generateRandomID } = require("../utils");
const { sendCustomError, handleError } = require("../utils/errors");

async function getAllUsers(req, response) {
  const query = {
    text: "SELECT todo.task, users.username, todo.is_done FROM todo LEFT JOIN users ON users.id = todo.user_id",
  };
  pool
    .query(query)
    .then((result) => {
      response.json({ users: result.rows });
    })
    .catch((err) => console.log(err.stack));
}

async function getUserById(req, response) {
  const query = {
    text: "SELECT username, profile_pic_url FROM users WHERE id = $1",
    values: [req.params.id],
  };
  pool
    .query(query)
    .then((result) => {
      response.json({ userDetail: result.rows[0] });
    })
    .catch((err) => console.log(err.stack));
}

const createUser = async (req, res) => {
  const { username, password, role = "user" } = req.body;
  if (!username || !password) {
    return sendCustomError(res, 400, "Username and password are required");
  }

  try {
    const encryptedPass = await bcrypt.hashSync(password, 10);
    const query = {
      text: "INSERT INTO users (id, username, password, role, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      values: [generateRandomID(), username, encryptedPass, role, new Date()],
    };

    const { rows } = await pool.query(query);
    const userData = rows[0];
    jwt.sign(
      {
        id: userData.id,
        username,
        role,
      },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: TOKEN_EXPIRATION,
      }
    );
    return res
      .status(201)
      .json({ message: "User created successfully!", user: userData.id });
  } catch (e) {
    handleError(res, e);
  }
};

async function editUserProfilePic(req, res) {
  try {
    const query = {
      text: "UPDATE users SET profile_pic_url = $1 WHERE id = $2 RETURNING profile_pic_url",
      values: [req.body.profilePicUrl, req.params.userId],
    };
    await pool.query(query);
    res.status(200).json({ message: "Profile picture updated successfully!" });
  } catch (e) {
    handleError(res, e);
  }
}

async function editUserData(req, res) {
  try {
    const query = {
      text: "UPDATE users SET username = $1 WHERE id = $2 RETURNING username",
      values: [req.body.username, req.params.userId],
    };
    await pool.query(query);
    res.status(200).json({ message: "Username succesfully updated!" });
  } catch (e) {
    handleError(res, e);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  editUserProfilePic,
  editUserData,
};
