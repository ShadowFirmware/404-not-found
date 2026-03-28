import { useEffect, useState, useCallback } from 'react';
import { X, Heart, Users, MessageCircle, Clock, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { matchService } from '../../services/matchService';
import { useChat } from '../../context/ChatContext';
import './NotificationsPanel.css';

const TIPOS = {
  new_match:        { icon: Users,          color: '#667eea', etiqueta: 'Match'   },
  like_received:    { icon: Heart,          color: '#ff1e77', etiqueta: 'Like'    },
  message_received: { icon: MessageCircle,  color: '#10b981', etiqueta: 'Mensaje' },
};

const getRelativeTime = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)    return 'ahora';
  if (diff < 3600)  return `${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const NotificationsPanel = ({ onClose, setActiveTab }) => {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);
  const { setActiveChat }     = useChat();

  const load = useCallback(async () => {
    try {
      const data = await matchService.getActivity(50);
      setNotifs(data);
    } catch {
      // sin conexión — panel vacío
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleClick = (notif) => {
    if (notif.type === 'message_received' && notif.match_id) {
      setActiveChat(notif.match_id);
      setActiveTab('chats');
      onClose();
    } else if (notif.type === 'new_match') {
      setActiveTab('matches');
      onClose();
    }
  };

  const unread = notifs.filter((n) => n.type === 'message_received' && !n.leido).length;

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        className="notif-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel deslizante */}
      <motion.div
        className="notif-panel"
        initial={{ x: 380, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 380, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 340, damping: 32 }}
      >
        {/* Header */}
        <div className="notif-header">
          <div className="notif-title">
            <Bell size={20} />
            <h2>Notificaciones</h2>
            {unread > 0 && <span className="notif-badge-header">{unread}</span>}
          </div>
          <button className="notif-close-btn" onClick={onClose} aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        {/* Lista */}
        <div className="notif-list">
          {loading ? (
            <p className="notif-empty">Cargando…</p>
          ) : notifs.length === 0 ? (
            <div className="notif-empty">
              <Bell size={40} strokeWidth={1.2} />
              <p>Sin notificaciones aún</p>
            </div>
          ) : (
            notifs.map((notif) => {
              const cfg       = TIPOS[notif.type] || TIPOS.new_match;
              const IconComp  = cfg.icon;
              const isUnread  = notif.type === 'message_received' && !notif.leido;
              const clickable = notif.type === 'message_received' || notif.type === 'new_match';

              return (
                <div
                  key={notif.id}
                  className={`notif-item ${isUnread ? 'unread' : ''} ${clickable ? 'clickable' : ''}`}
                  onClick={() => clickable && handleClick(notif)}
                >
                  <div className="notif-icon-wrap" style={{ background: `${cfg.color}18`, color: cfg.color }}>
                    <IconComp size={19} strokeWidth={2.2} />
                  </div>

                  <div className="notif-content">
                    <p className="notif-text">
                      <strong>{notif.nombre}</strong> {notif.mensaje}
                    </p>
                    <div className="notif-meta">
                      <span className="notif-tag" style={{ color: cfg.color }}>{cfg.etiqueta}</span>
                      <span className="notif-time">
                        <Clock size={11} /> {getRelativeTime(notif.timestamp)}
                      </span>
                    </div>
                  </div>

                  {isUnread && <span className="notif-unread-dot" />}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="notif-footer">
          <button className="notif-refresh-btn" onClick={load}>
            Actualizar
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationsPanel;
