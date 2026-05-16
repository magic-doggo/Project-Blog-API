const { Router } = require("express");
const postRouter = Router();
const postController = require("../controllers/postController.js");
const verifyToken = require("../middleware/verifyToken.js"); //check if user is logged in

// //routes anyone can access, logged in or not
postRouter.get("/", postController.getAllPublishedPostsWithAuthors);
postRouter.get("/:postId", postController.getPublishedPostWithAuthor);
postRouter.get("/:postId/comments", postController.getCommentsOfPublishedPost);

// //routes only logged in users can access, regardless of user privileges
postRouter.post("/:postId/comments", verifyToken, postController.createNewCommentOnPublishedPost); //post comment on published post ONNLY, implement in controller!!!
// postRouter.put("/:postId/comments/:commentId", verifyToken, postController.updateCommentOnPublishedPost) //not checking for admin. users can modify own comments, implemented in controller
// postRouter.delete("/:postId/comments/:commentId", verifyToken, postController.deleteCommentOnPublishedPost)//not checking for admin. users can delete own comments, implemented in controller

module.exports = postRouter;