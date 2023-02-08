const express = require("express");
const { PORT } = require("./configs");
const router = require("./routes");
const cors = require("cors");
const { generateRandomID } = require("./utils");

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

const a = generateRandomID();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
