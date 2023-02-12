const PORT = process.env.PORT || 8000;
const POSTGRES_CONFIG = {
  database: "postgres",
  password: "peni1941",
};
const TOKEN_EXPIRATION = 3 * 60 * 60; // 3 hours
const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60; // 7 days

const CORS_CONFIG = {
  origin: "http://localhost:4000",
  credentials: true,
};

module.exports = {
  PORT,
  POSTGRES_CONFIG,
  TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  CORS_CONFIG,
};
