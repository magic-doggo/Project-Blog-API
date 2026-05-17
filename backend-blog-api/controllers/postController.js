const { prisma } = require("../lib/prisma.js");
const { isAuthorized } = require("../utils/permissions.js");
const { sanitizePostBody } = require("../utils/sanitizePostBody.js");
//go back and update all res.json to return objects e.g. posts: postsWithAuthors

async function getAllPostsWithAuthors(req, res) {
    try {
        const postsWithAuthors = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                },
                _count: {
                    select: { comments: true } //https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing
                }
            }
        });
        res.json({
            posts: postsWithAuthors
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error fetching posts" })
    }
}

async function getAllPublishedPostsWithAuthors(req, res) {
    try {
        const publishedPostsWithAuthors = await prisma.post.findMany({
            where: {
                isPublished: true,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        // email: true, //do I actually need to show this?
                        username: true
                    }
                },
                _count: {
                    select: { comments: true } //https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing
                }
            }
        });
        res.json({
            posts: publishedPostsWithAuthors
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error fetching posts" })
    }

}

async function getPostWithAuthor(req, res) {
    try {
        const postWithAuthor = await prisma.post.findUnique({
            where: { id: Number(req.params.postId) },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        username: true
                    }
                },
                _count: {
                    select: { comments: true } //maybe move this to getcomments?
                }
            }
        })
        res.json({ post: postWithAuthor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error fetching post" })
    }
}

async function getPublishedPostWithAuthor(req, res) {
    try {
        const publishedPostWithAuthor = await prisma.post.findUnique({
            where: {
                id: Number(req.params.postId),
                isPublished: true,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        // email: true,
                        username: true
                    }
                },
                _count: {
                    select: { comments: true } //maybe move this to getcomments?
                }
            }
        })
        res.json({ post: publishedPostWithAuthor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error fetching post" })
    }
}

async function getCommentsOfPost(req, res) {
    try {
        const commentsOfPost = await prisma.comment.findMany({
            where: { postId: Number(req.params.postId) },
            include: {
                author: {
                    select: { username: true }
                }
            }
        });
        res.json({ comments: commentsOfPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error fetching comments" })
    }
}

async function getCommentsOfPublishedPost(req, res) {
    try {
        const commentsOfPublishedPost = await prisma.comment.findMany({
            where: {
                postId: Number(req.params.postId),
                post: { isPublished: true },
            },
            include: {
                author: {
                    select: { username: true }
                }
            }
        });
        res.json({ comments: commentsOfPublishedPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error fetching comments" })
    }
}

async function createNewPost(req, res) {
    try {
        const { title, postBody } = req.body;
        const authorId = req.user.userId //from login/register jwt.sign({ userId: user.id }
        const newPost = await prisma.post.create({
            data: {
                title: title,
                body: sanitizePostBody(postBody),
                authorId: authorId
            }
        })
        console.log(newPost, "test");
        res.json({ post: newPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error creating post" });
    }
}

async function createNewComment(req, res) {
    try {
        const { commentBody } = req.body; //destructuring const commentBody = req.body.commentBody;
        const authorId = req.user.userId //from login/register jwt.sign({ userId: user.id }
        const newComment = await prisma.comment.create({
            data: {
                postId: Number(req.params.postId),
                body: commentBody,
                authorId: authorId
            }
        });
        res.json({ comment: newComment })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error creating comment" })
    }
}

async function createNewCommentOnPublishedPost(req, res) {
    try {
        const { commentBody } = req.body;
        const authorId = req.user.userId //from login/register jwt.sign({ userId: user.id }
        const postId = Number(req.params.postId);

        const post = await prisma.post.findUnique({
            where: { id: postId, isPublished: true },
            select: { id: true },
        });

        if (!post) {
            return res.status(404).json({ error: "Post not found" })
        }

        const newCommentOnPublishedPost = await prisma.comment.create({
            data: {
                postId: postId,
                body: commentBody,
                authorId: authorId
            }
        });
        res.json({ comment: newCommentOnPublishedPost })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error creating comment" })
    }
}

async function updatePost(req, res) {
    try {
        const updatedPost = await prisma.post.update({
            where: {
                id: Number(req.params.postId)
            },
            data: {
                title: req.body.title,
                body: req.body.postBody,
            }
        });
        res.json(updatedPost);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error updating post" })
    }
}

async function updatePostStatus(req, res) {
    const { isPublished } = req.body;
    if (typeof isPublished !== 'boolean') return res.status(400).json({ error: "isPublished must be true or false" });
    try {
        let updatedPostStatus = await prisma.post.update({
            where: {
                id: Number(req.params.postId),
            },
            data: {
                isPublished: isPublished,
                publishedDate: isPublished ? new Date() : null
            }
        });
        console.log(updatedPostStatus, " updatedpoststatus")
        res.json(updatedPostStatus);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error updating the post status (published/unpublished)" })
    }
}

async function updateComment(req, res) {
    const commentId = Number(req.params.commentId);
    try {
        const comment = await prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment) return res.status(404).json({ error: "comment not found" });
        if (!isAuthorized(req.user, comment)) return res.status(403).json({ error: "You can only edit your own comments" });
        const updatedComment = await prisma.comment.update({
            where: {
                id: commentId,
            },
            data: {
                body: req.body.commentBody,
            }
        });
        res.json({ comment: updatedComment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error updating comment" })
    }
}

async function updateCommentOnPublishedPost(req, res) {
    const commentId = Number(req.params.commentId);
    const postId = Number(req.params.postId);
    try {
        const comment = await prisma.comment.findFirst({
            where: {
                id: commentId, postId: postId,
                post: { isPublished: true },
            }
        });
        if (!comment) return res.status(404).json({ error: "comment not found" });
        if (!isAuthorized(req.user, comment)) return res.status(403).json({ error: "You can only edit your own comments" });
        const updatedCommentOnPublishedPost = await prisma.comment.update({
            where: {
                id: commentId,
            },
            data: {
                body: req.body.commentBody,
            }
        });
        res.json({ comment: updatedCommentOnPublishedPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error updating comment" })
    }
}

async function deletePost(req, res) {
    try {
        const deletedPost = await prisma.post.delete({
            where: {
                id: Number(req.params.postId)
            }
        });
        res.json({ deletedPost: deletedPost });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error deleting post" })
    }
}

async function deleteComment(req, res) {
    const commentId = Number(req.params.commentId);
    const comment = await prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) return res.status(404).json({ error: "comment not found" });
    if (!isAuthorized(req.user, comment)) return res.status(403).json({ error: "You can only edit your own comments" });

    try {
        const deletedComment = await prisma.comment.delete({
            where: {
                id: commentId,
            }
        });
        res.json({ deletedComment: deletedComment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error deleting comment" })
    }
}

async function deleteCommentOnPublishedPost(req, res) {
    const commentId = Number(req.params.commentId);
    const postId = Number(req.params.postId);
    try {
        const comment = await prisma.comment.findFirst({
            where: {
                id: commentId,
                post: { isPublished: true },
                postId: postId
            },
        });
        if (!comment) return res.status(404).json({ error: "comment not found" });
        if (!isAuthorized(req.user, comment)) return res.status(403).json({ error: "You can only delete your own comments" });

        const deletedComment = await prisma.comment.delete({
            where: {
                id: commentId,
            }
        });
        res.json({ deletedComment: deletedComment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error deleting comment" })
    }
}

module.exports = {
    getAllPostsWithAuthors,
    getAllPublishedPostsWithAuthors,
    getPostWithAuthor,
    getPublishedPostWithAuthor,
    getCommentsOfPost,
    getCommentsOfPublishedPost,
    createNewPost,
    createNewComment,
    createNewCommentOnPublishedPost,
    updatePost,
    updatePostStatus,
    updateComment,
    updateCommentOnPublishedPost,
    deleteComment,
    deleteCommentOnPublishedPost,
    deletePost
}