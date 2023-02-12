const bcrypt = require("bcryptjs/dist/bcrypt");
const pool = require("../database");
const jwt = require("jsonwebtoken");
const { TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } = require("../configs");
const { generateRandomID } = require("../utils");

const DEFAULT_USER_ROLE = "user";

const registerUser = async (req, response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new Error("Username and password are required");
    }
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

    const { rows } = await pool.query(query);
    const { id, role, username: userName } = rows[0];
    const jwtSecret = `${process.env.JWT_SECRET}`;

    const accessToken = jwt.sign(
      {
        id,
        username: userName,
        role,
      },
      jwtSecret,
      {
        expiresIn: TOKEN_EXPIRATION,
      }
    );

    const refreshToken = jwt.sign(
      {
        id,
        username: userName,
        role,
      },
      jwtSecret,
      {
        expiresIn: REFRESH_TOKEN_EXPIRATION,
      }
    );

    response.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: REFRESH_TOKEN_EXPIRATION * 1000,
    });

    response.status(201).json({
      message: "User created successfully!",
      userId: id,
      role,
      username: userName,
      accessToken,
    });
  } catch (error) {
    console.error(error.message);
    response.status(400).json({ error: error.message });
  }
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
      const { id, role, username } = result.rows[0];
      const jwtSecret = `${process.env.JWT_SECRET}`;
      const accessToken = jwt.sign(
        {
          id,
          username: username,
          role,
        },
        jwtSecret,
        {
          expiresIn: TOKEN_EXPIRATION,
        }
      );

      const refreshToken = jwt.sign(
        {
          id,
          username: username,
          role,
        },
        jwtSecret,
        {
          expiresIn: REFRESH_TOKEN_EXPIRATION,
        }
      );
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        maxAge: TOKEN_EXPIRATION * 1000, // converted to milliseconds
      });
      res.status(201).json({
        message: "Login successful",
        userId: id,
        role,
        username,
        accessToken,
      });
    })
    .catch((err) => {
      console.log(err.stack);
      res.status(404).json({ message: err.stack });
    });
};

const logoutUser = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Logout failed" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
