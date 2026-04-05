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


module.exports = {
    getAllPostsWithAuthors,
    getPostWithAuthor
}