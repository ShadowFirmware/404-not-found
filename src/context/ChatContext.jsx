import { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { chatService } from '../services/chatService';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import { useRefresh } from './RefreshContext';

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
  const [activeChat, _setActiveChat]        = useState(null);
  const setActiveChat = (id) => { activeChatRef.current = id; _setActiveChat(id); };
  const [loadingConversations, setLoadingConversations] = useState(false);

  const wsRef              = useRef(null);
  const reconnectTimerRef  = useRef(null);
  const activeChatRef      = useRef(null);
  const [wsVersion, setWsVersion] = useState(0); // incrementar fuerza reconexión
  const { isAuthenticated, user } = useAuth();
  const { connectToChat } = useSocket();
  const refreshCtx = useRefresh();

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
        // Mascota del otro usuario
        petName:         conv.otra_mascota?.nombre   || 'Mascota',
        petImage:        conv.otra_mascota?.foto_url || 'https://via.placeholder.com/50',
        ownerName:       conv.otro_dueño?.nombre     || 'Usuario',
        // Mi propia mascota en este match
        myPetName:       conv.mi_mascota?.nombre     || '',
        myPetImage:      conv.mi_mascota?.foto_url   || '',
        lastMessage:     conv.ultimo_mensaje?.contenido        || '',
        lastMessageTime: conv.ultimo_mensaje?.['fecha_envío']  || new Date().toISOString(),
        unreadCount:     conv.mensajes_no_leidos     || 0,
      }));

      setConversations((prev) =>
        mapped.map((conv) => {
          const existing = prev.find((c) => c.matchId === conv.matchId);
          // Si el chat está activo, mantener unreadCount en 0
          if (conv.matchId === activeChatRef.current) return { ...conv, unreadCount: 0 };
          // Si ya teníamos la conv en memoria, conservar el mayor entre ambos
          if (existing) return { ...conv, unreadCount: Math.max(conv.unreadCount, existing.unreadCount) };
          return conv;
        })
      );
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
    clearTimeout(reconnectTimerRef.current);

    if (!activeChat || !isAuthenticated) return;

    const chatId = activeChat; // capturar para closure

    // 1. Cargar historial de mensajes via REST
    const loadHistory = async () => {
      try {
        const data = await chatService.getMessages(chatId);
        const mapped = data.map((msg) => ({
          id:         msg.msg_id,
          matchId:    chatId,
          text:       msg.contenido,
          sender:     msg.remitente === user?.dueño_id ? 'me' : msg.remitente,
          senderName: msg.remitente_nombre,
          timestamp:  msg['fecha_envío'],
          read:       msg['leído'],
          pending:    false,
        }));
        setMessages((prev) => ({ ...prev, [chatId]: mapped }));
      } catch (error) {
        console.error('Error cargando mensajes:', error);
      }
    };

    loadHistory();

    // 2. Abrir WebSocket para mensajes en tiempo real
    const ws = connectToChat(chatId, {
      onMessage: (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'chat_message') {
          const isFromMe = data.sender_id === user?.dueño_id;
          const newMsg = {
            id:         data.msg_id,
            matchId:    chatId,
            text:       data.message,
            sender:     isFromMe ? 'me' : data.sender_id,
            senderName: data.sender_name,
            timestamp:  data.timestamp,
            read:       false,
            pending:    false,
          };

          setMessages((prev) => {
            const current = prev[chatId] || [];

            // Evitar duplicado (mismo msg_id ya en lista)
            if (current.some((m) => m.id === data.msg_id)) return prev;

            if (isFromMe) {
              // Reemplazar el mensaje optimista pendiente con el confirmado
              const pendingIdx = current.reduce(
                (found, m, i) => (m.pending && m.text === data.message ? i : found),
                -1
              );
              if (pendingIdx !== -1) {
                const updated = [...current];
                updated[pendingIdx] = newMsg;
                return { ...prev, [chatId]: updated };
              }
            }

            return { ...prev, [chatId]: [...current, newMsg] };
          });

          setConversations((prev) =>
            prev.map((conv) =>
              conv.matchId === chatId
                ? { ...conv, lastMessage: data.message, lastMessageTime: data.timestamp }
                : conv
            )
          );

          refreshCtx?.triggerRefresh('activity');
          refreshCtx?.triggerRefresh('stats');
        }
      },
      onClose: (event) => {
        // Reconectar automáticamente en cierres inesperados (no limpios)
        if (event.code !== 1000 && event.code !== 1001) {
          reconnectTimerRef.current = setTimeout(() => {
            setWsVersion((v) => v + 1);
          }, 3000);
        }
      },
      onError: (err) => console.error('WebSocket error:', err),
    });

    wsRef.current = ws;

    return () => {
      clearTimeout(reconnectTimerRef.current);
      ws.close(1000, 'chat change');
      if (wsRef.current === ws) wsRef.current = null;
    };
  }, [activeChat, isAuthenticated, wsVersion]); // wsVersion fuerza reconexión

  // ─── Enviar mensaje (WebSocket primero, REST como fallback) ────────────────
  const sendMessage = async (matchId, messageText) => {
    const ws = wsRef.current;

    if (ws && ws.readyState === WebSocket.OPEN) {
      // Mostrar mensaje al instante (optimistic update)
      const tempId = `pending_${Date.now()}`;
      const optimistic = {
        id:         tempId,
        matchId,
        text:       messageText,
        sender:     'me',
        senderName: user?.nombre || 'Yo',
        timestamp:  new Date().toISOString(),
        read:       true,
        pending:    true,
      };
      setMessages((prev) => ({
        ...prev,
        [matchId]: [...(prev[matchId] || []), optimistic],
      }));
      setConversations((prev) =>
        prev.map((conv) =>
          conv.matchId === matchId
            ? { ...conv, lastMessage: messageText, lastMessageTime: optimistic.timestamp }
            : conv
        )
      );

      // Enviar al servidor — el echo reemplazará el mensaje pendiente
      ws.send(
        JSON.stringify({
          type:     'chat_message',
          match_id: matchId,
          message:  messageText,
        })
      );
    } else {
      // Fallback: REST API (el servidor también hará broadcast al grupo WS)
      try {
        const msg = await chatService.sendMessage(matchId, messageText);
        const newMsg = {
          id:      msg.msg_id,
          matchId,
          text:    msg.contenido,
          sender:  'me',
          timestamp: msg['fecha_envío'],
          read:    false,
          pending: false,
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
        refreshCtx?.triggerRefresh('stats');
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
