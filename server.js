const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// Configurar Express para servir archivos estáticos
app.use(express.static('public'));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Almacenar usuarios conectados y mensajes
const users = new Map();
const messages = [];

// Manejar conexiones de Socket.io
io.on('connection', (socket) => {
  console.log('Un usuario se conectó:', socket.id);

  // Usuario se une con su nombre
  socket.on('join', (username) => {
    users.set(socket.id, username);
    console.log(`${username} se unió al chat`);
    
    // Enviar historial de mensajes al nuevo usuario
    socket.emit('message_history', messages);
    
    // Notificar a todos que un nuevo usuario se unió
    io.emit('user_joined', {
      username: username,
      userCount: users.size
    });
  });

  // Recibir y reenviar mensajes
  socket.on('send_message', (data) => {
    const username = users.get(socket.id);
    const messageData = {
      username: username,
      message: data.message,
      timestamp: new Date().toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
    
    // Guardar mensaje en historial
    messages.push(messageData);
    
    // Limitar historial a últimos 100 mensajes
    if (messages.length > 100) {
      messages.shift();
    }
    
    // Enviar mensaje a todos los usuarios
    io.emit('receive_message', messageData);
  });

  // Indicador de "está escribiendo"
  socket.on('typing', () => {
    const username = users.get(socket.id);
    socket.broadcast.emit('user_typing', username);
  });

  socket.on('stop_typing', () => {
    socket.broadcast.emit('user_stop_typing');
  });

  // Usuario se desconecta
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    if (username) {
      console.log(`${username} se desconectó`);
      users.delete(socket.id);
      
      // Notificar a todos que un usuario se fue
      io.emit('user_left', {
        username: username,
        userCount: users.size
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('¡Tu WhatsApp Clone está listo!');
});
