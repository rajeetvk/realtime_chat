require('dotenv').config();
require('./config/db'); // Load and test the database connection
const express = require("express");
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Middleware to parse incoming JSON data from forms
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Import and mount our new Authentication Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})