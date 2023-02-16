const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_EXPIRATION } = require("../configs");
const pool = require("../database");
const { generateRandomID } = require("../utils");
const { sendError, handleError } = require("../utils/errors");

function getAllUsers(req, response) {
  const query = { text: "SELECT * FROM users" };
  pool
    .query(query)
    .then((res) => response.json({ users: res.rows }))
    .catch((err) => console.log(err.stack));
}

const createUser = async (req, res) => {
  const { username, password, role = "user" } = req.body;
  if (!username || !password) {
    return sendError(res, 400, "Username and password are required");
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
  } catch (err) {
    handleError(res, err);
  }
};

module.exports = { getAllUsers, createUser };
