const {Router} = require("express");
const userRouter = Router();

const userController = require("../controllers/userController");

userRouter.delete('/:userId', userController.deleteUser);

module.exports = userRouter;
