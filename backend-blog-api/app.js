const express = require("express");
const app = express();
const cors = require('cors');
const allowedOrigins = [
  "http://localhost:5173", //reader app
  "http://localhost:5174", //admin app
  "https://blog-api-frontend-reader.vercel.app", //reader app
  "https://blog-api-frontend-admin.vercel.app" //admin app
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
const adminPostRouter = require("./routes/adminPostRouter");
const publicPostRouter = require("./routes/publicPostRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");


app.use("/posts", publicPostRouter);
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