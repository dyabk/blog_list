const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controllers/blogs");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

mongoose
  .connect(config.MONGO_URL)
  .then(() => {
    logger.info("Connected to MongoDB.");
  })
  .catch((error) => {
    logger.error("Encountered an error connecting to MongoDB: ", error.message);
  });

app.use(cors());
app.use(express.json());

app.use("/api/blogs", notesRouter);

module.exports = app;
