const { Pool } = require("pg");
const { POSTGRES_CONFIG } = require("../configs");

const pool = new Pool(POSTGRES_CONFIG);

pool.connect((err) => {
  if (err) {
    console.error("connection error", err.stack);
  } else {
    console.log("Postgres connected !");
  }
});

module.exports = pool;
