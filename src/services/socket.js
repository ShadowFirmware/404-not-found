import io from 'socket.io-client';

let socket = null;

export const initSocket = (token) => {
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8000';
  
  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
