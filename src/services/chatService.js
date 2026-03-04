import api from './api';

export const chatService = {
  getConversations: async () => {
    const response = await api.get('/chat/conversations/');
    return response.data;
  },

  getMessages: async (conversationId) => {
    const response = await api.get(`/chat/conversations/${conversationId}/messages/`);
    return response.data;
  },

  sendMessage: async (conversationId, message) => {
    const response = await api.post(`/chat/conversations/${conversationId}/messages/`, {
      message,
    });
    return response.data;
  },
};
