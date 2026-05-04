const express = require("express");
const app = express();
var cors = require('cors')
app.use(cors());

app.use(express.json());
const adminPostRouter = require("./routes/adminPostRouter");
// const publicPostRouter = require("./routes/publicPostRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");


// app.use("/posts", publicPostRouter);
app.use("/admin/posts", adminPostRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter)
const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});