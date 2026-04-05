const express = require("express");
const app = express();
app.use(express.json());
const postRouter = require("./routes/postRouter");


// app.use("/", postRouter);
app.use("/posts", postRouter);

const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});