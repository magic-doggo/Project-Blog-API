const { prisma } = require("../lib/prisma.js")

async function deleteUser(req, res) {
    const targetUserId = Number(req.params.userId);
    const requestingUserId = req.user.userId;
    const requestingUserRole = req.user.role;
    try {
        const userExists = await prisma.user.findUnique({
            where: {
                id: targetUserId
            },
        });
        if (!userExists) return res.status(404).json({ error: "user not found" });

        if (requestingUserRole.role !== "ADMIN" && requestingUserId !== targetUserId) return res.status(403).json({ error: "you may only delete your own account" });

        const deletedUser = await prisma.user.delete({
            where: {
                id: targetUserId
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
        res.status(500).json({ error: "error deleting user" })
    }
}

module.exports = {
    deleteUser
}