import { Heart, Users, Eye, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import './ActivityFeed.css';

const ActivityFeed = () => {
  // TODO: Reemplazar con datos reales del backend
  // GET /api/users/me/activity/
  const activities = [
    {
      id: 1,
      type: 'like_received',
      user: {
        name: 'Pablo Perez',
        photo: 'https://i.pravatar.cc/150?img=12'
      },
      timestamp: '2h',
      icon: Heart,
      color: '#ff1e77',
      message: 'te dio like'
    },
    {
      id: 2,
      type: 'new_match',
      user: {
        name: 'Max',
        photo: 'https://i.pravatar.cc/150?img=33'
      },
      timestamp: '3h',
      icon: Users,
      color: '#667eea',
      message: 'Nuevo match'
    },
    {
      id: 3,
      type: 'profile_view',
      user: {
        name: 'Jafeh Perez',
        photo: 'https://i.pravatar.cc/150?img=25'
      },
      timestamp: '5h',
      icon: Eye,
      color: '#f59e0b',
      message: 'vio tu perfil'
    },
    {
      id: 4,
      type: 'nearby_pets',
      count: 3,
      timestamp: '1h',
      icon: MapPin,
      color: '#10b981',
      message: 'nuevas mascotas cerca'
    }
  ];

  const getRelativeTime = (timestamp) => {
    return timestamp;
  };

  return (
    <div className="activity-feed">
      <div className="activity-header">
        <h3>Actividad Reciente</h3>
      </div>
      
      <div className="activity-list">
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            className="activity-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 4 }}
          >
            <div 
              className="activity-icon"
              style={{ 
                backgroundColor: `${activity.color}15`,
                color: activity.color 
              }}
            >
              <activity.icon size={18} strokeWidth={2.5} />
            </div>
            
            <div className="activity-content">
              {activity.type === 'nearby_pets' ? (
                <div className="activity-text">
                  <span className="activity-count">{activity.count}</span> {activity.message}
                </div>
              ) : (
                <div className="activity-text">
                  <span className="activity-user">{activity.user.name}</span> {activity.message}
                </div>
              )}
              <div className="activity-time">
                <Clock size={12} />
                <span>{getRelativeTime(activity.timestamp)}</span>
              </div>
            </div>

            {activity.user && (
              <div className="activity-avatar">
                <img src={activity.user.photo} alt={activity.user.name} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <button className="activity-view-all">
        Ver todas las notificaciones
      </button>
    </div>
  );
};

export default ActivityFeed;
