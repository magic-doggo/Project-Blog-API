const { prisma } = require("../lib/prisma.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
                password: true,
                username: true, //will I need this for frontend? remove if not
                role: true
            }
        });
        if (!user) {
            return res.status(401).json({ error: "invalid email or password" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: "invalid email or password" }); //wrong password
        }
        const userDetailsExceptPassword = {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role
            //maybe I will need ROLE here later and username?
        }

        jwt.sign({ userId: user.id, role: user.role }, process.env.jwtSecretKey, { expiresIn: "1d" }, (err, token) => {
            if (err) return res.status(500).json({ error: "error generating token" });
            res.json({
                user: userDetailsExceptPassword,
                token: token
            })
        })

        // return res.json({ message: "login successful. jwt will be implemented later" });
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
                password: hashedPassword,
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        });
        jwt.sign({ userId: user.id, role: "USER" }, process.env.jwtSecretKey, { expiresIn: "1d" }, (err, token) => {
            if (err) return res.status(500).json({ error: "error generating token" });
            res.json({
                user: user,
                token: token
            })
        })
        // res.json({ user: user })
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "error registering user" })
    }
}

async function getCurrentUser(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, username: true, email: true, role: true }
        })
        if (!user) return res.status(404).json({error: "User not found"})
    } catch (err) {
        res.status(500).json({error: "error fetching user data"})
    }
}

module.exports = {
    login,
    logout,
    register,
    getCurrentUser
}