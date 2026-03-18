import { Heart, MessageCircle, Eye, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import './StatsPanel.css';

const StatsPanel = () => {
  // TODO: Reemplazar con datos reales del backend
  // GET /api/users/me/stats/
  const stats = {
    totalMatches: 12,
    activeChats: 3,
    petsViewedToday: 8,
    newLikes: 5
  };

  const statItems = [
    {
      icon: Heart,
      label: 'Matches',
      value: stats.totalMatches,
      color: '#ff1e77',
      bgColor: 'rgba(255, 30, 119, 0.1)'
    },
    {
      icon: MessageCircle,
      label: 'Chats Activos',
      value: stats.activeChats,
      color: '#667eea',
      bgColor: 'rgba(102, 126, 234, 0.1)'
    },
    {
      icon: Eye,
      label: 'Vistas Hoy',
      value: stats.petsViewedToday,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      icon: TrendingUp,
      label: 'Nuevos Likes',
      value: stats.newLikes,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    }
  ];

  return (
    <div className="stats-panel">
      <div className="stats-header">
        <h3>Mis Estadísticas</h3>
      </div>
      
      <div className="stats-grid">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <div 
              className="stat-icon"
              style={{ 
                backgroundColor: item.bgColor,
                color: item.color 
              }}
            >
              <item.icon size={20} strokeWidth={2.5} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsPanel;
