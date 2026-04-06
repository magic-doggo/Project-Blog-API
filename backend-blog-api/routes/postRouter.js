const { Router } = require("express");
const postRouter = Router();
// const { prisma } = require("../lib/prisma.js")
const postController = require("../controllers/postController.js")

postRouter.get("/", postController.getAllPostsWithAuthors);
postRouter.get("/:postId", postController.getPostWithAuthor);
postRouter.get("/:postId/comments", postController.getCommentsOfPost);

postRouter.post("/", postController.createNewPost);
postRouter.post("/:postId/comments", postController.createNewComment);

postRouter.put("/:postId", postController.updatePost);
postRouter.put("/:postId/status", postController.updatePostStatus) //updates whether post is published to public and when
postRouter.put("/:postId/comments/:commentId", postController.updateComment)


postRouter.delete("/:postId", postController.deletePost);
postRouter.delete("/:postId/comments/:commentId", postController.deleteComment) //do I even need to bother specifying postId? db knows correct commentId.





module.exports = postRouter;
