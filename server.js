const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

let messages = []; // Array to store messages

// Predefined users
const users = {
    a: 'pgcs',
    b: 'pgcs',
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
    let userId = null;

    ws.on('message', (message) => {
        const msgData = JSON.parse(message);

        // Check for login
        if (msgData.type === 'login') {
            if (msgData.username in users && users[msgData.username] === msgData.password) {
                userId = msgData.username;
                ws.send(JSON.stringify({ type: 'login', success: true, messages }));
            } else if (msgData.username === 'guest') {
                userId = 'guest';
                ws.send(JSON.stringify({ type: 'login', success: true, messages }));
            } else {
                ws.send(JSON.stringify({ type: 'login', success: false }));
            }
            return;
        }

        // If the user is logged in, broadcast the message
        if (userId) {
            const messageToSend = { username: userId, text: msgData.text };
            messages.push(messageToSend); // Store message
            // Limit the stored messages to the last 100
            if (messages.length > 100) messages.shift();
            // Broadcast to all connected clients
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(messageToSend));
                }
            });
        }
    });
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
