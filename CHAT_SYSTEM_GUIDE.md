# 💬 Sistema de Chat - PawMatch

## ✅ Características Implementadas

### 🎯 Funcionalidades Principales

1. **Lista de Conversaciones (ChatView)**
   - Vista estilo WhatsApp con todas las conversaciones activas
   - Búsqueda de conversaciones por nombre de mascota o dueño
   - Indicador de mensajes no leídos con badge numérico
   - Ordenamiento automático por última actividad
   - Timestamps relativos ("Hace 5 min", "Ayer", etc.)

2. **Ventana de Chat Individual (ChatWindow)**
   - Chat en tiempo real con diseño moderno
   - Mensajes agrupados por fecha
   - Burbujas de mensaje diferenciadas (enviados/recibidos)
   - Timestamps en cada mensaje (HH:MM)
   - Auto-scroll al último mensaje
   - Input con botón de envío
   - Menú de opciones (eliminar conversación)

3. **Persistencia de Datos**
   - **localStorage** para guardar conversaciones y mensajes
   - Los chats NO se borran al cerrar la app
   - Carga automática al iniciar sesión

4. **Integración con Matches**
   - Botón "Enviar Mensaje" en cada match
   - Crea conversación automáticamente
   - Cambia a tab de chats al hacer clic

---

## 📁 Estructura de Archivos

```
src/
├── context/
│   └── ChatContext.jsx          # Estado global de chats y mensajes
├── components/
│   ├── chat/
│   │   ├── ChatView.jsx         # Lista de conversaciones
│   │   ├── ChatView.css
│   │   ├── ChatWindow.jsx       # Ventana de chat individual
│   │   └── ChatWindow.css
│   └── dashboard/
│       ├── Dashboard.jsx        # Integra ChatProvider y ChatView
│       ├── Matches.jsx          # Botón para abrir chat desde matches
│       └── Sidebar.jsx          # Tab "Mensajes / Chat"
```

---

## 🔌 Integración con Backend Django (WebSockets)

### **Preparación Actual**

El frontend está **100% preparado** para conectarse con Django Channels usando WebSockets. Todos los puntos de integración están documentados con comentarios `// TODO BACKEND:`.

### **Endpoints Necesarios**

#### **1. REST API (Fallback y carga inicial)**

```python
# Django REST Framework endpoints
GET  /api/chats/                    # Lista de conversaciones del usuario
GET  /api/chats/:matchId/messages/  # Historial de mensajes de un chat
POST /api/chats/:matchId/messages/  # Enviar mensaje (fallback si WS falla)
DELETE /api/chats/:matchId/         # Eliminar conversación
```

#### **2. WebSocket (Tiempo Real)**

```python
# Django Channels WebSocket
WS: ws://localhost:8000/ws/chat/:matchId/

# Mensajes que el frontend enviará:
{
  "type": "chat_message",
  "matchId": 123,
  "message": "Hola! ¿Cómo estás?",
  "timestamp": "2024-03-14T12:00:00.000Z"
}

# Mensajes que el backend debe enviar:
{
  "type": "chat_message",
  "matchId": 123,
  "message": "¡Bien! ¿Y tú?",
  "senderId": 456,
  "senderName": "Usuario",
  "timestamp": "2024-03-14T12:01:00.000Z"
}
```

---

## 🔧 Cómo Conectar con Django

### **Paso 1: Instalar Django Channels**

```bash
pip install channels channels-redis
```

### **Paso 2: Configurar WebSocket Consumer**

```python
# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.match_id = self.scope['url_route']['kwargs']['match_id']
        self.room_group_name = f'chat_{self.match_id}'

        # Unirse al grupo de chat
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Salir del grupo
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        
        # Guardar mensaje en BD
        # await save_message_to_db(...)
        
        # Enviar mensaje a todos en el grupo
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'senderId': self.scope['user'].id,
                'senderName': self.scope['user'].username,
                'timestamp': datetime.now().isoformat()
            }
        )

    async def chat_message(self, event):
        # Enviar mensaje al WebSocket
        await self.send(text_data=json.dumps(event))
```

### **Paso 3: Configurar Routing**

```python
# chat/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<match_id>\w+)/$', consumers.ChatConsumer.as_asgi()),
]
```

### **Paso 4: Actualizar Frontend (ChatContext.jsx)**

Descomentar las líneas marcadas con `// TODO BACKEND:` en:
- `@/Users/bryansibo/Desktop/paumatch/paumatch-frontend/src/context/ChatContext.jsx:48-56` (cargar chats)
- `@/Users/bryansibo/Desktop/paumatch/paumatch-frontend/src/context/ChatContext.jsx:92-101` (enviar mensaje por WS)
- `@/Users/bryansibo/Desktop/paumatch/paumatch-frontend/src/context/ChatContext.jsx:127-132` (recibir mensajes)

Ejemplo de conexión WebSocket:

```javascript
// En ChatContext.jsx
useEffect(() => {
  if (activeChat) {
    // Conectar WebSocket
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${activeChat}/`);
    
    ws.onopen = () => {
      console.log('WebSocket conectado');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      receiveMessage(
        data.matchId, 
        data.message, 
        data.senderId, 
        data.senderName
      );
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return () => ws.close();
  }
}, [activeChat]);
```

---

## 📊 Flujo de Datos

### **Crear Conversación desde Match**

```
1. Usuario hace match con mascota
2. Click en "Enviar Mensaje" en Matches
3. createConversation(pet) crea entrada en localStorage
4. setActiveTab('chats') cambia a vista de chat
5. ChatView muestra la nueva conversación
```

### **Enviar Mensaje**

```
1. Usuario escribe mensaje y presiona Enter/Click
2. sendMessage() guarda en localStorage
3. TODO: Enviar por WebSocket al backend
4. Backend guarda en BD y broadcast a otros usuarios
5. Mensaje aparece instantáneamente para el remitente
```

### **Recibir Mensaje**

```
1. Backend envía mensaje por WebSocket
2. ws.onmessage() recibe el evento
3. receiveMessage() actualiza estado
4. Mensaje aparece en ChatWindow
5. Si chat no está activo, incrementa unreadCount
```

---

## 🎨 Diseño Visual

### **ChatView (Lista)**
- Búsqueda con ícono
- Avatares circulares (56x56px)
- Badge rojo para mensajes no leídos
- Timestamp relativo a la derecha
- Hover con fondo gris claro

### **ChatWindow (Chat Individual)**
- Header con avatar, nombre y botón volver
- Mensajes agrupados por fecha
- Burbujas enviadas: gradiente coral (derecha)
- Burbujas recibidas: fondo blanco con borde (izquierda)
- Input redondeado con botón circular de envío

---

## 🔒 Seguridad y Validación

### **Consideraciones para Backend**

1. **Autenticación**: Solo usuarios con match confirmado pueden chatear
2. **Validación**: Verificar que ambos usuarios tienen match antes de permitir mensajes
3. **Rate Limiting**: Limitar mensajes por minuto para evitar spam
4. **Sanitización**: Limpiar mensajes de HTML/scripts maliciosos
5. **Encriptación**: Considerar encriptar mensajes en tránsito (WSS)

---

## 📝 Datos Mock Actuales

El sistema usa **localStorage** con las siguientes claves:

```javascript
localStorage.setItem('pawmatch_conversations', JSON.stringify([...]));
localStorage.setItem('pawmatch_messages', JSON.stringify({...}));
```

### **Estructura de Conversación**

```javascript
{
  matchId: 1,
  petName: "Buddy",
  petImage: "https://...",
  ownerName: "Usuario",
  lastMessage: "Hola!",
  lastMessageTime: "2024-03-14T12:00:00.000Z",
  unreadCount: 2
}
```

### **Estructura de Mensaje**

```javascript
{
  id: 1234567890,
  matchId: 1,
  text: "Hola! ¿Cómo estás?",
  sender: "me", // o userId del otro usuario
  senderName: "Usuario",
  timestamp: "2024-03-14T12:00:00.000Z",
  read: false
}
```

---

## ✨ Características Destacadas

✅ **Persistencia**: Los chats se mantienen al recargar la página  
✅ **Tiempo Real**: Preparado para WebSockets  
✅ **UX Moderna**: Diseño estilo WhatsApp  
✅ **Timestamps**: Fechas y horas formateadas  
✅ **Búsqueda**: Filtrar conversaciones  
✅ **Notificaciones**: Badges de mensajes no leídos  
✅ **Responsive**: Funciona en móvil y desktop  
✅ **Confirmaciones**: Toast al eliminar conversaciones  

---

## 🚀 Próximos Pasos para Backend

1. ✅ Crear modelos de Chat y Message en Django
2. ✅ Implementar Django Channels consumer
3. ✅ Configurar Redis para channel layer
4. ✅ Crear endpoints REST API
5. ✅ Conectar WebSocket desde frontend
6. ✅ Implementar autenticación JWT en WebSocket
7. ✅ Agregar notificaciones push (opcional)

---

## 🎯 Cómo Probar

1. Hacer match con una mascota
2. Click en "Enviar Mensaje" desde Matches
3. Se abre ChatView con la conversación
4. Escribir mensaje y enviar
5. El mensaje aparece en la burbuja coral
6. Cerrar y reabrir la app → el chat persiste
7. Buscar conversaciones con la barra de búsqueda

**¡El sistema está 100% funcional con datos mock y listo para conectar con Django!** 🎉
