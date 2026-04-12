function verifyAdmin (req, res, next) {
    //from login/register jwt.sign({ userId: user.id }
    if ( req.user.role === "ADMIN") {
        next();
    } else {
        return res.status(403).json({error: "Access denied. Only an admin can perform this action"})
    }
}

module.exports = verifyAdmin;