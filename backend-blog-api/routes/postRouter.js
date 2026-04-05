const { Router } = require("express");
const postRouter = Router();
// const { prisma } = require("../lib/prisma.js")
const postsController = require("../controllers/postsController.js")

postRouter.get("/", postsController.getAllPostsWithAuthors);

postRouter.get("/:postId", postsController.getPostWithAuthor);

module.exports = postRouter;
