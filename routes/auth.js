const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');



// 1. USER REGISTRATION

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: "Please provide username and password" });

        // Check if user already exists (using pg-promise)
        const userExists = await db.query('SELECT * FROM users WHERE username =$1', [username]);
        if (userExists.length > 0) {
            return res.status(400).json({ error: "Username already taken.Try another one." });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        const newUser = await db.one('INSERT INTO users (username,password) VALUES ($1,$2) RETURNING id,username', [username, hashedpassword]);

        res.status(201).json({ message: "User registered successfully", user: newUser });

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Server Error while registration" });
    }
})


// 2. USER LOGIN

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const users = await db.any('SELECT * FROM users WHERE username=$1', [username]);
        if (users.length === 0) {
            return res.status(400).json({ error: "Invalid username or password" });
        }
        const user = users[0];

        const ismatch = await bcrypt.compare(password, user.password);
        if (!ismatch) {
            return res.status(400).json({ error: "Invalid username or password." });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ message: "Login successfully", token: token, username: user.username });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error while login" });
    }
});

module.exports = router;
