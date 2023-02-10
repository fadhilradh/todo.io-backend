const bcrypt = require("bcryptjs/dist/bcrypt");
const pool = require("../database");
const jwt = require("jsonwebtoken");
const { TOKEN_EXPIRATION } = require("../configs");
const { generateRandomID } = require("../utils");

const DEFAULT_USER_ROLE = "user";

const registerUser = async (req, response) => {
  const { username, password = "user" } = req.body;
  if (!username || !password)
    return response
      .status(400)
      .json({ message: "Username and password are required" });
  const encryptedPass = await bcrypt.hashSync(password, 10);

  const query = {
    text: "INSERT INTO users (id, username, password, role, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    values: [
      generateRandomID(),
      username,
      encryptedPass,
      DEFAULT_USER_ROLE,
      new Date(),
    ],
  };
  pool
    .query(query)
    .then((res) => {
      const userData = res.rows[0];
      const token = jwt.sign(
        {
          id: userData.id,
          username,
          role: DEFAULT_USER_ROLE,
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
        .json({ message: "User created successfully!", userId: userData.id });
    })
    .catch((err) => {
      console.log(err.stack);
      response.status(400).json({ error: err.stack });
    });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  const query = {
    text: "SELECT * FROM users WHERE username = $1",
    values: [username],
  };
  pool
    .query(query)
    .then((result) => {
      console.log("🚀 ~ file: auth.js:70 ~ .then ~ result", result.rows);
      if (result.rows.length === 0) {
        return res.status(400).json({ message: "Username not found" });
      }
      const isPasswordMatch = bcrypt.compareSync(
        password,
        result.rows[0].password
      );
      if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }
      const userData = result.rows[0];
      const token = jwt.sign(
        {
          id: userData.id,
          username,
          role: DEFAULT_USER_ROLE,
        },
        `${process.env.JWT_SECRET}`,
        {
          expiresIn: TOKEN_EXPIRATION,
        }
      );
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: TOKEN_EXPIRATION * 1000, // converted to milliseconds
      });
      res
        .status(201)
        .json({ message: "Login successful", userId: userData.id });
    })
    .catch((err) => {
      console.log(err.stack);
      res.status(404).json({ message: err.stack });
    });
};

module.exports = {
  registerUser,
  loginUser,
};
