import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, MoreVertical, Trash2 } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import toast from 'react-hot-toast';
import './ChatWindow.css';

const ChatWindow = () => {
  const { 
    conversations, 
    messages, 
    activeChat, 
    setActiveChat, 
    sendMessage,
    deleteConversation 
  } = useChat();
  
  const [messageText, setMessageText] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const currentConversation = conversations.find(c => c.matchId === activeChat);
  const chatMessages = messages[activeChat] || [];

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Focus en input al abrir chat
  useEffect(() => {
    inputRef.current?.focus();
  }, [activeChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;

    sendMessage(activeChat, messageText.trim());
    setMessageText('');

    // TODO BACKEND: El mensaje se enviará por WebSocket
    // websocket.send(JSON.stringify({
    //   type: 'chat_message',
    //   matchId: activeChat,
    //   message: messageText.trim()
    // }));
  };

  const handleDeleteConversation = () => {
    toast((t) => (
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 12px 0', fontWeight: '600' }}>
          ¿Eliminar conversación con {currentConversation?.petName}?
        </p>
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
          Se eliminarán todos los mensajes
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => {
              deleteConversation(activeChat);
              toast.success('Conversación eliminada');
              toast.dismiss(t.id);
            }}
            style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Eliminar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: '8px 16px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: { minWidth: '300px' }
    });
    setShowMenu(false);
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatMessageDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'long',
        year: 'numeric'
      });
    }
  };

  // Agrupar mensajes por fecha
  const groupMessagesByDate = () => {
    const groups = {};
    chatMessages.forEach(msg => {
      const dateKey = new Date(msg.timestamp).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    return groups;
  };

  const messageGroups = groupMessagesByDate();

  if (!currentConversation) {
    return null;
  }

  return (
    <div className="chat-window">
      {/* Header del chat */}
      <div className="chat-window-header">
        <button 
          className="back-button"
          onClick={() => setActiveChat(null)}
        >
          <ArrowLeft size={24} />
        </button>

        <div className="chat-window-info">
          <img 
            src={currentConversation.petImage} 
            alt={currentConversation.petName}
            className="chat-avatar"
          />
          <div>
            <h3>{currentConversation.petName}</h3>
            <p className="owner-name">{currentConversation.ownerName}</p>
          </div>
        </div>

        <div className="chat-menu">
          <button 
            className="menu-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical size={24} />
          </button>
          
          {showMenu && (
            <div className="menu-dropdown">
              <button 
                className="menu-item delete"
                onClick={handleDeleteConversation}
              >
                <Trash2 size={18} />
                Eliminar conversación
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Área de mensajes */}
      <div className="messages-container">
        {Object.keys(messageGroups).length === 0 ? (
          <div className="empty-chat">
            <div className="empty-chat-content">
              <img 
                src={currentConversation.petImage} 
                alt={currentConversation.petName}
                className="empty-chat-image"
              />
              <h3>¡Hicieron match! 💕</h3>
              <p>Inicia una conversación con {currentConversation.petName}</p>
            </div>
          </div>
        ) : (
          Object.entries(messageGroups).map(([dateKey, msgs]) => (
            <div key={dateKey}>
              <div className="date-divider">
                <span>{formatMessageDate(msgs[0].timestamp)}</span>
              </div>
              
              {msgs.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}
                >
                  <div className="message-bubble">
                    <p>{msg.text}</p>
                    <span className="message-time">
                      {formatMessageTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de mensaje */}
      <form className="message-input-container" onSubmit={handleSendMessage}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Escribe un mensaje..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          className="message-input"
        />
        <button 
          type="submit"
          className="send-button"
          disabled={!messageText.trim()}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
