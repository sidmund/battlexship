import { insertUser, getUser } from '../models/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const SALT_ROUNDS = 10;


export const self = async (req, res) => {
    if (req.user) {
        res.status(200).json({ user: req.user });
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
};

export const login = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = getUser(username);
    if (user === undefined) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        await bcrypt.compare(password, user.bcryptPassword)
            ? res.status(200).json({ token: generateToken(user) })
            : res.status(401).json({ error: "Unauthorized" });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Only normal users can be created
// After successful account creation, the new user is immediately authorized with a new token
export const register = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);
        const changes = insertUser({
            username,
            bcryptPassword: hash,
            level: 1, // 1 = user, 2 = admin
        });
        return changes === 0
            ? res.status(400).json({ error: "User already exists" })
            : res.status(201).json({ token: generateToken(getUser(username)) });
    } catch (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: "User already exists" });
        }

        console.error(err.message);
        return res.status(500).json({ error: "Could not create user" });
    }
};


const generateToken = (user) => jwt.sign(
    {
        data: {
            user: {
                id: user.id,
                username: user.username,
                level: user.level,
                rank: user.rank,
                credits: user.credits,
            },
        },
    },
    process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_LIFETIME,
    }
);