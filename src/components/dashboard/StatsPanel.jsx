import { useState, useCallback } from 'react';
import { Heart, MessageCircle, PawPrint, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { matchService } from '../../services/matchService';
import useAutoRefresh from '../../hooks/useAutoRefresh';
import './StatsPanel.css';

const StatsPanel = () => {
  const [stats, setStats] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await matchService.getStats();
      setStats(data);
    } catch {}
  }, []);

  useAutoRefresh(load, 30000);

  const statItems = [
    { icon: Heart,         label: 'Matches',        value: stats?.total_matches,   color: '#ff1e77', bgColor: 'rgba(255,30,119,0.1)' },
    { icon: MessageCircle, label: 'Chats Activos',   value: stats?.active_chats,    color: '#667eea', bgColor: 'rgba(102,126,234,0.1)' },
    { icon: TrendingUp,    label: 'Likes Recibidos', value: stats?.likes_recibidos, color: '#10b981', bgColor: 'rgba(16,185,129,0.1)' },
    { icon: PawPrint,      label: 'Mis Mascotas',    value: stats?.total_mascotas,  color: '#f59e0b', bgColor: 'rgba(245,158,11,0.1)' },
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
            transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
          >
            <div className="stat-icon" style={{ backgroundColor: item.bgColor, color: item.color }}>
              <item.icon size={20} strokeWidth={2.5} />
            </div>
            <div className="stat-info">
              <AnimatePresence mode="wait">
                <motion.div
                  key={item.value ?? 'loading'}
                  className="stat-value"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.value ?? '—'}
                </motion.div>
              </AnimatePresence>
              <div className="stat-label">{item.label}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatsPanel;
