const socket = io();
const messages = document.getElementById('messages');
const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');

const Username = prompt("Enter your name");
socket.emit('new-user', Username);

function addMessage(msg, type = 'other') {
    const div = document.createElement('div');
    div.textContent = msg;
    div.classList.add('message');
  
    if (type === 'own') div.classList.add('own');
    else if (type === 'system') div.classList.add('system');
    else div.classList.add('other');
  
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = input.value;
    if (message.trim() !== '') {
      addMessage(`You: ${message}`, 'own');  
      socket.emit('send-message', message);
      input.value = '';
    }
});

socket.on('chat-message', (data) => {
    if (data.name !== Username) {
      addMessage(`${data.name}: ${data.message}`, 'other');
    }
});
  
socket.on('user-joined', (msg) => {
    addMessage(msg, 'system');
});
 
socket.on('user-left', (msg) => {
    addMessage(msg, 'system');
});