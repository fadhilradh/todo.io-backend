const PORT = process.env.PORT || 8000;
const POSTGRES_CONFIG = {
  database: process.env.POSTGRES_DB || "postgres",
  password: process.env.POSTGRES_PASSWORD || "peni1941",
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || "postgres",
};
const TOKEN_EXPIRATION = 3 * 60 * 60; // 3 hours
const REFRESH_TOKEN_EXPIRATION = 7 * 24 * 60 * 60; // 7 days

const CORS_CONFIG = {
  origin: "*",
  credentials: true,
};

module.exports = {
  PORT,
  POSTGRES_CONFIG,
  TOKEN_EXPIRATION,
  REFRESH_TOKEN_EXPIRATION,
  CORS_CONFIG,
};
