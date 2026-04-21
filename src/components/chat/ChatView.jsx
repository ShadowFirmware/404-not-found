import { useState, useEffect } from 'react';
import { Search, MessageCircle } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import ChatWindow from './ChatWindow';
import './ChatView.css';

const ChatView = () => {
  const { conversations, activeChat, setActiveChat, markAsRead } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    return () => setActiveChat(null);
  }, []);

  const filteredConversations = conversations.filter(conv =>
    conv.petName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    return messageTime.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const handleConversationClick = (matchId) => {
    setActiveChat(matchId);
    markAsRead(matchId);
  };

  return (
    <div className="chat-layout">
      {/* ── Panel izquierdo: lista — oculto en móvil cuando hay chat activo ── */}
      <div className={`chat-panel-left ${activeChat ? 'mobile-hidden' : ''}`}>
        <div className="chat-header">
          <h1>Mensajes</h1>
          <p className="chat-subtitle">
            {conversations.length} conversación{conversations.length !== 1 ? 'es' : ''}
          </p>
        </div>

        <div className="chat-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="conversations-list">
          {filteredConversations.length === 0 ? (
            <div className="empty-conversations">
              <MessageCircle size={48} />
              <h3>Sin conversaciones</h3>
              <p>{searchQuery ? 'No encontrado' : 'Tus matches aparecerán aquí'}</p>
            </div>
          ) : (
            filteredConversations
              .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime))
              .map((conv) => (
                <div
                  key={conv.matchId}
                  className={`conversation-item ${conv.unreadCount > 0 ? 'unread' : ''} ${activeChat === conv.matchId ? 'active' : ''}`}
                  onClick={() => handleConversationClick(conv.matchId)}
                >
                  <div className="conversation-avatar">
                    <img
                      src={conv.petImage}
                      alt={conv.petName}
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/50?text=🐾'; }}
                    />
                    {conv.unreadCount > 0 && (
                      <span className="unread-badge">{conv.unreadCount}</span>
                    )}
                  </div>
                  <div className="conversation-content">
                    <div className="conversation-header">
                      <h3>{conv.petName}</h3>
                      <span className="conversation-time">{formatTime(conv.lastMessageTime)}</span>
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

      {/* ── Panel derecho: oculto en móvil cuando no hay chat activo ── */}
      <div className={`chat-panel-right ${!activeChat ? 'mobile-hidden' : ''}`}>
        {activeChat ? (
          <ChatWindow />
        ) : (
          <div className="chat-empty-state">
            <MessageCircle size={64} strokeWidth={1.2} />
            <h2>Selecciona una conversación</h2>
            <p>Elige un match de la lista para comenzar a chatear</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatView;
