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
    const url = `${SOCKET_URL}/ws/chat/${matchId}/?token=${token}`;
    const ws = new WebSocket(url);

    if (handlers.onOpen)    ws.onopen    = handlers.onOpen;
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
