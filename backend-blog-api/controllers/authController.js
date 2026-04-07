const { prisma } = require("../lib/prisma.js");
const bcrypt = require("bcryptjs");

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                id: true,
                email: true,
                password: true
            }
        });
        if (!user) {
            return res.status(401).json({ error: "invalid email or password" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "invalid or password" }); //wrong password
        }
        return res.json({ message: "login successful. jwt will be implemented later" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error logging in" })
    }
}

async function logout(req, res) {
    res.json({ message: "successfully logged out" })
}

async function register(req, res) {
    const { email, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        });
        res.json({ user: user })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error registering user" })
    }
}

module.exports = {
    login,
    logout,
    register
}