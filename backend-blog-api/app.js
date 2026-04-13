const express = require("express");
const app = express();
app.use(cors());

app.use(express.json());
const postRouter = require("./routes/postRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");


app.use("/posts", postRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter)
const PORT = 3000;
app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});