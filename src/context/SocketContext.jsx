import { createContext, useContext } from 'react';

const SocketContext = createContext(null);

/**
 * Convierte una URL HTTP a WebSocket.
 * "http://localhost:8000" → "ws://localhost:8000"
 */
const toWsUrl = (url) =>
  url.replace(/^http/, 'ws').replace(/^https/, 'wss');

export const SocketProvider = ({ children }) => {
  const SOCKET_URL = toWsUrl(
    import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000'
  );

  /**
   * Crea una conexión WebSocket a Django Channels para un chat específico.
   * El token se pasa como query param porque el browser no permite headers custom en WS.
   *
   * @param {number|string} matchId  - ID del match
   * @param {object}        handlers - { onOpen, onMessage, onClose, onError }
   * @returns {WebSocket}
   */
  const connectToChat = (matchId, handlers = {}) => {
    const token = localStorage.getItem('token');
    // No exponer el token en la URL — se envía como primer mensaje al conectar
    const url = `${SOCKET_URL}/ws/chat/${matchId}/`;
    const ws = new WebSocket(url);

    ws.onopen = (event) => {
      // Autenticar enviando el token como primer mensaje
      ws.send(JSON.stringify({ type: 'authenticate', token }));
      handlers.onOpen?.(event);
    };
    if (handlers.onMessage) ws.onmessage = handlers.onMessage;
    if (handlers.onClose)   ws.onclose   = handlers.onClose;
    if (handlers.onError)   ws.onerror   = handlers.onError;

    return ws;
  };

  return (
    <SocketContext.Provider value={{ connectToChat }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
