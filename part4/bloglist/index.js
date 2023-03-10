const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./utils/logger");
const config = require("./utils/config");
const blogsRouter = require("./controllers/blogs");

app.use(cors());
app.use(express.json());
app.use("/api/blogs/", blogsRouter);

const PORT = config.PORT;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
