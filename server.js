const express = require("express");
const { PORT, CORS_CONFIG } = require("./configs");
const router = require("./routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();

const app = express();
app.use(dotenv);
app.use(express.json());
app.use(cors(CORS_CONFIG));
app.use(cookieParser());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
