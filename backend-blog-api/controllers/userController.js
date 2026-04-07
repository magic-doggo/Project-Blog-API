const { prisma } = require("../lib/prisma.js")

async function deleteUser(req, res) {
    try {
        const userExists = await prisma.user.findUnique({
            where: {
                id: Number(req.params.userId)
            },
        });
        if (!userExists) return res.status(404).json({error: "user not found"});
        const deletedUser = await prisma.user.delete({
            where: {
                id: Number(req.params.userId)
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        });

        res.json({ deletedUser: deletedUser })
    } catch (err) {
        console.error(err);
        res.status(500).error({ error: "error deleting user" })
    }
}

module.exports = {
    deleteUser
}