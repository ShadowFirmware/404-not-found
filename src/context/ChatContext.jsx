import { createContext, useContext, useState, useEffect } from 'react';

// TODO BACKEND: WebSocket Integration con Django Channels
// =========================================================
// Este contexto maneja el estado de los chats y mensajes
// Cuando se integre el backend, reemplazar localStorage por:
// 1. WebSocket connection para mensajes en tiempo real
// 2. REST API para cargar historial de mensajes
// 
// Endpoints necesarios:
// - WS: ws://localhost:8000/ws/chat/:matchId/ (Django Channels)
// - GET /api/chats/ -> Lista de conversaciones del usuario
// - GET /api/chats/:matchId/messages/ -> Historial de mensajes
// - POST /api/chats/:matchId/messages/ -> Enviar mensaje (fallback si WS falla)

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe usarse dentro de ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  // Estado de conversaciones y mensajes
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);

  // Cargar datos desde localStorage al iniciar
  useEffect(() => {
    const savedConversations = localStorage.getItem('pawmatch_conversations');
    const savedMessages = localStorage.getItem('pawmatch_messages');
    
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    // TODO BACKEND: Reemplazar por llamada a API
    // const loadChats = async () => {
    //   const response = await fetch('/api/chats/', {
    //     headers: { 'Authorization': `Bearer ${token}` }
    //   });
    //   const data = await response.json();
    //   setConversations(data.conversations);
    // };
    // loadChats();
  }, []);

  // Guardar en localStorage cuando cambien las conversaciones
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('pawmatch_conversations', JSON.stringify(conversations));
    }
  }, [conversations]);

  // Guardar mensajes en localStorage
  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      localStorage.setItem('pawmatch_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Enviar mensaje
  const sendMessage = (matchId, messageText) => {
    const newMessage = {
      id: Date.now(),
      matchId,
      text: messageText,
      sender: 'me', // TODO BACKEND: Usar userId real
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Agregar mensaje al chat
    setMessages(prev => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMessage]
    }));

    // Actualizar última actividad de la conversación
    setConversations(prev => prev.map(conv => 
      conv.matchId === matchId 
        ? { 
            ...conv, 
            lastMessage: messageText,
            lastMessageTime: new Date().toISOString(),
            unreadCount: conv.matchId === activeChat ? 0 : (conv.unreadCount || 0)
          }
        : conv
    ));

    // TODO BACKEND: Enviar mensaje por WebSocket
    // if (websocket && websocket.readyState === WebSocket.OPEN) {
    //   websocket.send(JSON.stringify({
    //     type: 'chat_message',
    //     matchId,
    //     message: messageText,
    //     timestamp: newMessage.timestamp
    //   }));
    // }
  };

  // Recibir mensaje (simulado - en producción vendrá por WebSocket)
  const receiveMessage = (matchId, messageText, senderId, senderName) => {
    const newMessage = {
      id: Date.now(),
      matchId,
      text: messageText,
      sender: senderId,
      senderName,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages(prev => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMessage]
    }));

    setConversations(prev => prev.map(conv => 
      conv.matchId === matchId 
        ? { 
            ...conv, 
            lastMessage: messageText,
            lastMessageTime: new Date().toISOString(),
            unreadCount: conv.matchId === activeChat ? 0 : (conv.unreadCount || 0) + 1
          }
        : conv
    ));

    // TODO BACKEND: Este método se llamará cuando llegue un mensaje por WebSocket
    // websocket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   receiveMessage(data.matchId, data.message, data.senderId, data.senderName);
    // };
  };

  // Crear nueva conversación desde un match
  const createConversation = (match) => {
    const existingConv = conversations.find(c => c.matchId === match.id);
    if (existingConv) {
      setActiveChat(match.id);
      return;
    }

    const newConversation = {
      matchId: match.id,
      petName: match.name,
      petImage: match.image,
      ownerName: match.ownerName || 'Usuario', // TODO BACKEND: Obtener del match
      lastMessage: '',
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
    };

    setConversations(prev => [...prev, newConversation]);
    setMessages(prev => ({ ...prev, [match.id]: [] }));
    setActiveChat(match.id);
  };

  // Marcar mensajes como leídos
  const markAsRead = (matchId) => {
    setConversations(prev => prev.map(conv => 
      conv.matchId === matchId ? { ...conv, unreadCount: 0 } : conv
    ));

    setMessages(prev => ({
      ...prev,
      [matchId]: (prev[matchId] || []).map(msg => ({ ...msg, read: true }))
    }));
  };

  // Eliminar conversación
  const deleteConversation = (matchId) => {
    setConversations(prev => prev.filter(conv => conv.matchId !== matchId));
    setMessages(prev => {
      const newMessages = { ...prev };
      delete newMessages[matchId];
      return newMessages;
    });
    if (activeChat === matchId) {
      setActiveChat(null);
    }
  };

  const value = {
    conversations,
    messages,
    activeChat,
    setActiveChat,
    sendMessage,
    receiveMessage,
    createConversation,
    markAsRead,
    deleteConversation,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
