const ws = new WebSocket('ws://localhost:3000'); // Change to your deployed URL in production
let currentUser = null;

ws.onmessage = (event) => {
    const msgData = JSON.parse(event.data);
    if (msgData.type === 'login' && msgData.success) {
        msgData.messages.forEach(addMessage); // Display previous messages
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('chat-container').style.display = 'block';
    } else if (msgData.username) {
        addMessage(msgData);
    }
};

document.getElementById('loginButton').onclick = () => {
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;
    ws.send(JSON.stringify({ type: 'login', username, password }));
};

document.getElementById('sendButton').onclick = () => {
    const input = document.getElementById('messageInput');
    if (input.value.trim()) {
        ws.send(JSON.stringify({ text: input.value }));
        input.value = '';
    }
};

function addMessage(msg) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${msg.username === 'guest' ? 'guest' : 'user'}`;
    messageDiv.textContent = `${msg.username}: ${msg.text}`;
    document.getElementById('messages').appendChild(messageDiv);
}
