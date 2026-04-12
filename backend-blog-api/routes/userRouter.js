const {Router} = require("express");
const userRouter = Router();

const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

userRouter.delete('/:userId', verifyToken, userController.deleteUser);

module.exports = userRouter;
