import { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import ChatWindow from './ChatWindow';
import './ChatView.css';

const ChatView = () => {
  const { conversations, activeChat, setActiveChat, markAsRead } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrar conversaciones por búsqueda
  const filteredConversations = conversations.filter(conv =>
    conv.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Formatear tiempo relativo (ej: "Hace 5 min", "Ayer", "12/03/2024")
  const formatTime = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffMs = now - messageTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return messageTime.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleConversationClick = (matchId) => {
    setActiveChat(matchId);
    markAsRead(matchId);
  };

  // Si hay un chat activo, mostrar la ventana de chat
  if (activeChat) {
    return <ChatWindow />;
  }

  return (
    <div className="chat-view">
      <div className="chat-header">
        <h1>Mensajes</h1>
        <p className="chat-subtitle">
          {conversations.length} conversación{conversations.length !== 1 ? 'es' : ''}
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="chat-search">
        <Search size={20} />
        <input
          type="text"
          placeholder="Buscar conversaciones..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Lista de conversaciones */}
      <div className="conversations-list">
        {filteredConversations.length === 0 ? (
          <div className="empty-conversations">
            <MessageCircle size={64} />
            <h3>No hay conversaciones</h3>
            <p>
              {searchQuery 
                ? 'No se encontraron conversaciones con ese nombre'
                : 'Cuando tengas matches confirmados, podrás chatear aquí'}
            </p>
          </div>
        ) : (
          filteredConversations
            .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
            .map((conv) => (
              <div
                key={conv.matchId}
                className={`conversation-item ${conv.unreadCount > 0 ? 'unread' : ''}`}
                onClick={() => handleConversationClick(conv.matchId)}
              >
                <div className="conversation-avatar">
                  <img src={conv.petImage} alt={conv.petName} />
                  {conv.unreadCount > 0 && (
                    <span className="unread-badge">{conv.unreadCount}</span>
                  )}
                </div>

                <div className="conversation-content">
                  <div className="conversation-header">
                    <h3>{conv.petName}</h3>
                    <span className="conversation-time">
                      {formatTime(conv.lastMessageTime)}
                    </span>
                  </div>
                  <div className="conversation-preview">
                    <p className={conv.unreadCount > 0 ? 'unread-text' : ''}>
                      {conv.lastMessage || 'Inicia una conversación'}
                    </p>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ChatView;
