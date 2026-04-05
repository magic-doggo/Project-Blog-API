const { Router } = require("express");
const postRouter = Router();
// const { prisma } = require("../lib/prisma.js")
const postController = require("../controllers/postController.js")

postRouter.get("/", postController.getAllPostsWithAuthors);
postRouter.get("/:postId", postController.getPostWithAuthor);
postRouter.get("/:postId/comments", postController.getCommentsOfPost);

postRouter.post("/", postController.createNewPost);
postRouter.post("/:postId/comments", postController.createNewComment)

module.exports = postRouter;
