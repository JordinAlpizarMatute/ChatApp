// Conectar al servidor Socket.io
const socket = io();

// Elementos del DOM
const welcomeScreen = document.getElementById('welcome-screen');
const chatScreen = document.getElementById('chat-screen');
const usernameInput = document.getElementById('username-input');
const joinBtn = document.getElementById('join-btn');
const logoutBtn = document.getElementById('logout-btn');
const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const typingIndicator = document.getElementById('typing-indicator');
const userCountSpan = document.getElementById('user-count');

let currentUsername = '';
let isTyping = false;
let typingTimeout;

// Unirse al chat
joinBtn.addEventListener('click', joinChat);
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinChat();
});

function joinChat() {
    const username = usernameInput.value.trim();
    
    if (username === '') {
        alert('Por favor ingresa un nombre');
        return;
    }
    
    currentUsername = username;
    socket.emit('join', username);
    
    // Cambiar a pantalla de chat
    welcomeScreen.classList.add('hidden');
    chatScreen.classList.remove('hidden');
    messageInput.focus();
}

// Salir del chat
logoutBtn.addEventListener('click', () => {
    location.reload();
});

// Enviar mensaje
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
    const message = messageInput.value.trim();
    
    if (message === '') return;
    
    socket.emit('send_message', { message });
    messageInput.value = '';
    messageInput.focus();
    
    // Detener indicador de escribiendo
    socket.emit('stop_typing');
    isTyping = false;
}

// Detectar cuando el usuario está escribiendo
messageInput.addEventListener('input', () => {
    if (!isTyping) {
        socket.emit('typing');
        isTyping = true;
    }
    
    clearTimeout(typingTimeout);
    
    typingTimeout = setTimeout(() => {
        socket.emit('stop_typing');
        isTyping = false;
    }, 1000);
});

// Recibir historial de mensajes
socket.on('message_history', (messages) => {
    messages.forEach(msg => {
        displayMessage(msg, msg.username === currentUsername);
    });
});

// Recibir nuevos mensajes
socket.on('receive_message', (data) => {
    const isOwnMessage = data.username === currentUsername;
    displayMessage(data, isOwnMessage);
});

// Mostrar mensaje en el chat
function displayMessage(data, isOwn) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isOwn ? 'own' : 'other'}`;
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${!isOwn ? `<div class="message-header">${data.username}</div>` : ''}
            <div class="message-text">${escapeHtml(data.message)}</div>
            <div class="message-time">${data.timestamp}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    
    // Hacer scroll hacia abajo
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Limpiar floats
    const clearDiv = document.createElement('div');
    clearDiv.style.clear = 'both';
    messagesContainer.appendChild(clearDiv);
}

// Usuario se unió
socket.on('user_joined', (data) => {
    updateUserCount(data.userCount);
    
    if (data.username !== currentUsername) {
        showSystemMessage(`${data.username} se unió al chat`);
    }
});

// Usuario se fue
socket.on('user_left', (data) => {
    updateUserCount(data.userCount);
    showSystemMessage(`${data.username} salió del chat`);
});

// Mostrar mensajes del sistema
function showSystemMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'system-message';
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Actualizar contador de usuarios
function updateUserCount(count) {
    userCountSpan.textContent = `${count} usuario${count !== 1 ? 's' : ''} conectado${count !== 1 ? 's' : ''}`;
}

// Indicador de "escribiendo..."
socket.on('user_typing', (username) => {
    typingIndicator.classList.remove('hidden');
    typingIndicator.querySelector('span').textContent = `${username} está escribiendo...`;
});

socket.on('user_stop_typing', () => {
    typingIndicator.classList.add('hidden');
});

// Función para escapar HTML y prevenir XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Notificación de conexión
socket.on('connect', () => {
    console.log('Conectado al servidor');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
    showSystemMessage('Conexión perdida. Recargando...');
    setTimeout(() => location.reload(), 2000);
});
