const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const { TOKEN_EXPIRATION } = require("../configs");
const pool = require("../database");
const { generateRandomID } = require("../utils");

function getAllUsers(req, response) {
  const query = { text: "SELECT * FROM users" };
  pool
    .query(query)
    .then((res) => response.json({ users: res.rows }))
    .catch((err) => console.log(err.stack));
}

const createUser = async (req, response) => {
  const { username, password, role = "user" } = req.body;
  if (!username || !password)
    return response
      .status(400)
      .json({ message: "Username and password are required" });
  const encryptedPass = await bcrypt.hashSync(password, 10);

  const query = {
    text: "INSERT INTO users (id, username, password, role, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    values: [generateRandomID(), username, encryptedPass, role, new Date()],
  };
  pool
    .query(query)
    .then((res) => {
      const userData = res.rows[0];
      const token = jwt.sign(
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
      response.cookie("jwt", token, {
        httpOnly: true,
        maxAge: TOKEN_EXPIRATION * 1000, // converted to milliseconds
      });
      response
        .status(201)
        .json({ message: "User created successfully!", user: userData.id });
    })
    .catch((err) => {
      console.log(err.stack);
      response.status(400).json({ error: err.stack });
    });
};

module.exports = { getAllUsers, createUser };
