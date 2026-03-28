import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { chatService } from '../services/chatService';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat debe usarse dentro de ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations]   = useState([]);
  const [messages, setMessages]             = useState({});
  const [activeChat, setActiveChat]         = useState(null);
  const [loadingConversations, setLoadingConversations] = useState(false);

  const wsRef = useRef(null);
  const { isAuthenticated, user } = useAuth();
  const { connectToChat } = useSocket();

  // ─── Limpiar todo el estado al cambiar de usuario (logout / cambio de cuenta)
  useEffect(() => {
    if (!user) {
      setConversations([]);
      setMessages({});
      setActiveChat(null);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    }
  }, [user]);

  // ─── Cargar lista de conversaciones desde el backend ───────────────────────
  const loadConversations = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingConversations(true);
    try {
      const data = await chatService.getConversations();

      const mapped = data.map((conv) => ({
        matchId:         conv.match_id,
        petName:         conv.otra_mascota?.nombre   || 'Mascota',
        petImage:        conv.otra_mascota?.foto_url || 'https://via.placeholder.com/50',
        ownerName:       conv.otro_dueño?.nombre     || 'Usuario',
        lastMessage:     conv.ultimo_mensaje?.contenido        || '',
        lastMessageTime: conv.ultimo_mensaje?.['fecha_envío']  || new Date().toISOString(),
        unreadCount:     conv.mensajes_no_leidos     || 0,
      }));

      setConversations(mapped);
    } catch (error) {
      console.error('Error cargando conversaciones:', error);
    } finally {
      setLoadingConversations(false);
    }
  }, [isAuthenticated]);

  // Recargar conversaciones cuando cambia el usuario (login de otro usuario)
  useEffect(() => {
    if (user) {
      setConversations([]);
      setMessages({});
      setActiveChat(null);
      loadConversations();
    }
  }, [user?.dueño_id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Polling: refrescar conversaciones cada 20s para unread counts y últimos mensajes
  useEffect(() => {
    if (!isAuthenticated) return;
    const id = setInterval(() => loadConversations(), 20000);
    return () => clearInterval(id);
  }, [isAuthenticated, loadConversations]);

  // ─── Conectar WebSocket + cargar historial cuando cambia el chat activo ────
  useEffect(() => {
    // Cerrar WebSocket anterior si lo hay
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    if (!activeChat || !isAuthenticated) return;

    // 1. Cargar historial de mensajes via REST
    const loadHistory = async () => {
      try {
        const data = await chatService.getMessages(activeChat);
        const mapped = data.map((msg) => ({
          id:         msg.msg_id,
          matchId:    activeChat,
          text:       msg.contenido,
          sender:     msg.remitente === user?.dueño_id ? 'me' : msg.remitente,
          senderName: msg.remitente_nombre,
          timestamp:  msg['fecha_envío'],
          read:       msg['leído'],
        }));
        setMessages((prev) => ({ ...prev, [activeChat]: mapped }));
      } catch (error) {
        console.error('Error cargando mensajes:', error);
      }
    };

    loadHistory();

    // 2. Abrir WebSocket para mensajes en tiempo real
    const ws = connectToChat(activeChat, {
      onMessage: (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'chat_message') {
          const newMsg = {
            id:         data.msg_id,
            matchId:    activeChat,
            text:       data.message,
            sender:     data.sender_id === user?.dueño_id ? 'me' : data.sender_id,
            senderName: data.sender_name,
            timestamp:  data.timestamp,
            read:       false,
          };

          setMessages((prev) => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), newMsg],
          }));

          setConversations((prev) =>
            prev.map((conv) =>
              conv.matchId === activeChat
                ? { ...conv, lastMessage: data.message, lastMessageTime: data.timestamp }
                : conv
            )
          );
        }
      },
      onError: (err) => console.error('WebSocket error:', err),
    });

    wsRef.current = ws;

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [activeChat, isAuthenticated]);

  // ─── Enviar mensaje (WebSocket primero, REST como fallback) ────────────────
  const sendMessage = async (matchId, messageText) => {
    const ws = wsRef.current;

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type:     'chat_message',
          match_id: matchId,
          message:  messageText,
        })
      );
    } else {
      // Fallback: REST API
      try {
        const msg = await chatService.sendMessage(matchId, messageText);
        const newMsg = {
          id:        msg.msg_id,
          matchId,
          text:      msg.contenido,
          sender:    'me',
          timestamp: msg['fecha_envío'],
          read:      false,
        };
        setMessages((prev) => ({
          ...prev,
          [matchId]: [...(prev[matchId] || []), newMsg],
        }));
        setConversations((prev) =>
          prev.map((conv) =>
            conv.matchId === matchId
              ? { ...conv, lastMessage: messageText, lastMessageTime: new Date().toISOString() }
              : conv
          )
        );
      } catch (error) {
        console.error('Error enviando mensaje:', error);
      }
    }
  };

  // ─── Crear nueva conversación desde un match ───────────────────────────────
  const createConversation = (match) => {
    const existing = conversations.find((c) => c.matchId === match.id);
    if (existing) {
      setActiveChat(match.id);
      return;
    }
    const newConv = {
      matchId:         match.id,
      petName:         match.name,
      petImage:        match.image,
      ownerName:       match.ownerName || 'Usuario',
      lastMessage:     '',
      lastMessageTime: new Date().toISOString(),
      unreadCount:     0,
    };
    setConversations((prev) => [...prev, newConv]);
    setMessages((prev)        => ({ ...prev, [match.id]: [] }));
    setActiveChat(match.id);
  };

  // ─── Marcar mensajes como leídos ──────────────────────────────────────────
  const markAsRead = (matchId) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.matchId === matchId ? { ...conv, unreadCount: 0 } : conv))
    );
    setMessages((prev) => ({
      ...prev,
      [matchId]: (prev[matchId] || []).map((msg) => ({ ...msg, read: true })),
    }));
  };

  // ─── Eliminar conversación (local) ────────────────────────────────────────
  const deleteConversation = (matchId) => {
    setConversations((prev) => prev.filter((conv) => conv.matchId !== matchId));
    setMessages((prev) => {
      const next = { ...prev };
      delete next[matchId];
      return next;
    });
    if (activeChat === matchId) setActiveChat(null);
  };

  // ─── Recibir mensaje externo (por si se necesita llamar manualmente) ───────
  const receiveMessage = (matchId, messageText, senderId, senderName) => {
    const newMsg = {
      id:         Date.now(),
      matchId,
      text:       messageText,
      sender:     senderId,
      senderName,
      timestamp:  new Date().toISOString(),
      read:       false,
    };
    setMessages((prev) => ({
      ...prev,
      [matchId]: [...(prev[matchId] || []), newMsg],
    }));
    setConversations((prev) =>
      prev.map((conv) =>
        conv.matchId === matchId
          ? {
              ...conv,
              lastMessage:     messageText,
              lastMessageTime: new Date().toISOString(),
              unreadCount:     conv.matchId === activeChat ? 0 : (conv.unreadCount || 0) + 1,
            }
          : conv
      )
    );
  };

  const value = {
    conversations,
    messages,
    activeChat,
    setActiveChat,
    loadingConversations,
    loadConversations,
    sendMessage,
    receiveMessage,
    createConversation,
    markAsRead,
    deleteConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
