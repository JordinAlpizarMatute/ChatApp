ChatApp - Chat en Tiempo Real

Una aplicación de chat en tiempo real similar a WhatsApp, construida con Node.js, Express y Socket.io.

Características

- ✅ Chat en tiempo real entre múltiples usuarios
- ✅ Mensajes instantáneos
- ✅ Indicador de "escribiendo..."
- ✅ Historial de mensajes (últimos 100)
- ✅ Notificaciones cuando usuarios entran/salen
- ✅ Contador de usuarios conectados
- ✅ Diseño moderno inspirado en WhatsApp
- ✅ Interfaz responsive (funciona en móviles y desktop)

Visita:**
   ```
   http://localhost:3000
   ```

3. **Para probar con múltiples usuarios:**
   - Abre varias pestañas del navegador
   - O comparte tu IP local con otros dispositivos en tu red
   - Cada pestaña/dispositivo puede usar un nombre de usuario diferente

 Estructura del proyecto

```
ChatApp/
│
├── server.js              # Servidor Node.js con Express y Socket.io
├── package.json           # Configuración del proyecto y dependencias
│
└── public/                # Archivos del frontend
    ├── index.html         # Estructura HTML
    ├── style.css          # Estilos CSS
    └── app.js             # Lógica del cliente (JavaScript)
```

Tecnologías utilizadas

- **Backend:**
  - Node.js
  - Express.js (servidor web)
  - Socket.io (comunicación en tiempo real)

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (Vanilla JS)
  - Socket.io Client

 🎯 Próximas mejoras (ideas para expandir)

- [ ] Salas de chat privadas
- [ ] Mensajes privados entre usuarios
- [ ] Envío de archivos/imágenes
- [ ] Base de datos (MongoDB/PostgreSQL) para persistencia
- [ ] Autenticación de usuarios
- [ ] Emojis y reacciones
- [ ] Cifrado de mensajes
- [ ] Notificaciones de escritorio
- [ ] Indicador de mensajes leídos/no leídos

 Notas para desarrollo

- El servidor escucha en el puerto 3000 por defecto
- Los mensajes solo persisten mientras el servidor está activo
- Para producción, considera usar una base de datos real
- Implementa validación y sanitización de datos para seguridad

## Contribuciones

Este es un proyecto educativo. Siéntete libre de:
- Hacer fork del proyecto
- Agregar nuevas características
- Reportar bugs
- Sugerir mejoras

##  Contacto

Proyecto creado con fines educativos para aprender desarrollo web con Node.js y Socket.io.


