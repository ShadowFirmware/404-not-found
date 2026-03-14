import './ChatSidebar.css';

const ChatSidebar = ({ chats }) => {
  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">
        <h3>Chats Activos</h3>
      </div>

      <div className="chat-list">
        {chats.map((chat) => (
          <div key={chat.id} className="chat-item">
            <div className="chat-avatar">
              <img src={chat.avatar} alt={chat.name} />
            </div>
            <div className="chat-info">
              <h4 className="chat-name">{chat.name}</h4>
              <p className="chat-preview">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
