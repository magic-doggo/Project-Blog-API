const { prisma } = require("../lib/prisma.js")

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
                    select: {comments: true} //https://www.prisma.io/docs/orm/prisma-client/queries/aggregation-grouping-summarizing
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

async function getPostWithAuthor(req, res) {
    try {
        const postWithAuthor = await prisma.post.findUnique({
            where: { id: Number(req.params.postId) }
        })
        res.json({ post: postWithAuthor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error fetching post" })
    }
}

async function getCommentsOfPost(req, res) {
    try {
        const commentsOfPost = await prisma.comment.findMany({
           where: {postId: Number(req.params.postId)} 
        });
        res.json({comments: commentsOfPost});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "error fetching comments"})
    }
}


module.exports = {
    getAllPostsWithAuthors,
    getPostWithAuthor,
    getCommentsOfPost
}