const { Router } = require("express");
const authRouter = Router();
// const { prisma } = require("../lib/prisma.js")
const authController = require("../controllers/authController.js")

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/logout", authController.logout);





module.exports = authRouter;
