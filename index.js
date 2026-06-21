require('dotenv').config();
const db = require('./config/db'); // Load and test the database connection
const express = require("express");
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const jwt = require('jsonwebtoken');

const io = new Server(server);

const onlineUsers = new Map();




// Middleware to parse incoming JSON data from forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Import and mount our new Authentication Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
        if (err) {
            return next(new Error("Authentication Error."))
        }
        socket.user = decodedUser;
        next();

    })
})
io.on('connection', (socket) => {
    console.log('A user connected:', socket.user.username);
    onlineUsers.set(socket.user.username, socket.id);
    io.emit('online users', Array.from(onlineUsers.keys()));

    db.any('SELECT users.username, messages.text FROM messages JOIN users ON messages.user_id = users.id ORDER BY messages.created_at ASC LIMIT 50')
        .then(history => {
            socket.emit('chat history', history);
        });

    socket.on('chat message', async (msg) => {
        try {
            await db.none('INSERT INTO messages (user_id,text) VALUES ($1,$2)', [socket.user.id, msg]);

            io.emit('chat message', { username: socket.user.username, text: msg });

        }
        catch (error) {
            console.error('Error saving message:', error);
        }
    });
    socket.on('private message', ({ targetUsername, text }) => {
        const targetSocketId = onlineUsers.get(targetUsername);

        if (targetSocketId) {
            io.to(targetSocketId).emit('private message', { username: socket.user.username, text: text });
            socket.emit('private message', { username: socket.user.username, text: text });
        }
    });

    socket.on('typing', () => {
    socket.broadcast.emit('user typing', socket.user.username);
});

socket.on('stop typing', () => {
    socket.broadcast.emit('user stopped typing', socket.user.username);
});

socket.on('disconnect', () => {
    console.log('User disconnected:', socket.user.username);

    onlineUsers.delete(socket.user.username);
    io.emit('online users', Array.from(onlineUsers.keys()));
});
});



const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})