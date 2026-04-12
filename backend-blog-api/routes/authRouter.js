const { Router } = require("express");
const authRouter = Router();
const authController = require("../controllers/authController.js");
const verifyToken = require("../middleware/verifyToken.js");

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/logout", authController.logout);
authRouter.post("/currentUser", verifyToken, authController.getCurrentUser);

module.exports = authRouter;
