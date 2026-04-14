import { useState, useCallback } from 'react';
import { Heart, Users, Clock, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { matchService } from '../../services/matchService';
import { useChat } from '../../context/ChatContext';
import useAutoRefresh from '../../hooks/useAutoRefresh';
import { useRefreshOn } from '../../context/RefreshContext';
import NotificationsPanel from './NotificationsPanel';
import './ActivityFeed.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

const ICONS = {
  new_match:        { icon: Users,         color: '#667eea' },
  like_received:    { icon: Heart,         color: '#ff1e77' },
  message_received: { icon: MessageCircle, color: '#10b981' },
};

const getRelativeTime = (isoString) => {
  const diff = Math.floor((Date.now() - new Date(isoString)) / 1000);
  if (diff < 60)    return 'ahora';
  if (diff < 3600)  return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const ActivityFeed = ({ setActiveTab }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showPanel, setShowPanel]   = useState(false);
  const { conversations }           = useChat();

  const load = useCallback(async () => {
    try {
      const data = await matchService.getActivity(8);
      setActivities(data);
    } catch {}
    finally { setLoading(false); }
  }, []);

  // Polling de seguridad cada 10s
  useAutoRefresh(load, 10000);
  // Refresco inmediato al recibir evento 'activity'
  useRefreshOn('activity', load);

  // Badge: mensajes no leídos + actividad nueva en el feed
  const unreadMessages = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const pendingLikes   = activities.filter((a) => a.type === 'like_received').length;
  const totalUnread    = unreadMessages + pendingLikes;

  return (
    <>
      <div className="activity-feed">
        <div className="activity-header">
          <h3>Actividad Reciente</h3>
        </div>

        <div className="activity-list">
          {loading ? (
            <p style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>Cargando...</p>
          ) : activities.length === 0 ? (
            <p style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '14px' }}>
              Sin actividad reciente. ¡Empieza a dar likes!
            </p>
          ) : (
            <AnimatePresence initial={false}>
              {activities.map((activity, index) => {
                const cfg       = ICONS[activity.type] || ICONS.new_match;
                const IconComp  = cfg.icon;
                const raw       = activity.foto || '';
                const photo     = raw.startsWith('http') ? raw : raw ? `${API_BASE}${raw}` : null;

                return (
                  <motion.div
                    key={activity.id}
                    className="activity-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
                    whileHover={{ x: 4, transition: { duration: 0.12 } }}
                  >
                    <div className="activity-icon" style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}>
                      <IconComp size={18} strokeWidth={2.5} />
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        <span className="activity-user">{activity.nombre}</span>{' '}
                        {activity.mensaje}
                      </div>
                      <div className="activity-time">
                        <Clock size={12} />
                        <span>{getRelativeTime(activity.timestamp)}</span>
                      </div>
                    </div>
                    {photo && (
                      <div className="activity-avatar">
                        <img src={photo} alt={activity.nombre}
                          onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; }} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        <button className="activity-view-all" onClick={() => setShowPanel(true)}>
          Ver todas las notificaciones
          {totalUnread > 0 && (
            <span className="activity-view-all-badge">{totalUnread}</span>
          )}
        </button>
      </div>

      {/* Panel de notificaciones */}
      <AnimatePresence>
        {showPanel && (
          <NotificationsPanel
            onClose={() => setShowPanel(false)}
            setActiveTab={setActiveTab}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ActivityFeed;
