const express = require("express");
const { PORT } = require("./configs");
const router = require("./routes/todos");

const app = express();
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
