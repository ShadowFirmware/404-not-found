import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import useAutoRefresh from '../../hooks/useAutoRefresh';
import toast from 'react-hot-toast';
import { matchService } from '../../services/matchService';
import { petService } from '../../services/petService';
import { useChat } from '../../context/ChatContext';
import './Matches.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

const Matches = ({ userPetId, onOpenChat }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myPetIds, setMyPetIds] = useState(new Set());
  const { createConversation } = useChat();

  const loadMatches = useCallback(async () => {
    setLoading(true);
    try {
      // Cargar mis mascotas para saber cuáles son propias
      const myPets = await petService.getMyPets();
      const ids = new Set(myPets.map((p) => p.mascota_id));
      setMyPetIds(ids);

      // Cargar todos los matches aceptados
      const data = await matchService.getAllMatches();

      // Convertir cada match al formato de la tarjeta
      const mapped = data.map((match) => {
        // Determinar cuál es la otra mascota
        const isM1Mine = ids.has(match.mascota1);
        const otraMascota = isM1Mine ? match.mascota2_data : match.mascota1_data;
        const image = otraMascota?.foto_url || 'https://via.placeholder.com/400x300?text=Sin+foto';

        return {
          matchId: match.match_id,
          id: otraMascota?.mascota_id,
          name: otraMascota?.nombre || 'Mascota',
          image,
          age: otraMascota?.edad != null ? `${otraMascota.edad} años` : '?',
          breed: otraMascota?.raza || otraMascota?.especie || '?',
          location: 'Cerca de ti',
          personality: otraMascota?.descripción || otraMascota?.especie || '',
          ownerName: otraMascota?.dueño_nombre || 'Usuario',
        };
      });

      setMatches(mapped);
    } catch {
      toast.error('Error al cargar los matches');
    } finally {
      setLoading(false);
    }
  }, []);

  useAutoRefresh(loadMatches, 30000);

  const handleSendMessage = (pet) => {
    createConversation({
      id: pet.matchId,
      name: pet.name,
      image: pet.image,
      ownerName: pet.ownerName,
    });
    onOpenChat && onOpenChat();
    toast.success(`Chat con ${pet.name} abierto`, { icon: '💬', duration: 2000 });
  };

  if (loading) {
    return (
      <div className="matches-container">
        <div className="matches-header"><h1>Matches</h1></div>
        <div className="empty-matches">
          <div className="empty-matches-icon">🐾</div>
          <h2>Cargando matches...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="matches-container">
      <div className="matches-header">
        <h1>Matches</h1>
        <p>{matches.length} {matches.length === 1 ? 'match encontrado' : 'matches encontrados'}</p>
      </div>

      {matches.length === 0 ? (
        <div className="empty-matches">
          <div className="empty-matches-icon">💔</div>
          <h2>No tienes matches aún</h2>
          <p>Comienza a dar like a las mascotas que te gusten en la pantalla de inicio</p>
        </div>
      ) : (
        <div className="matches-grid">
          <AnimatePresence>
          {matches.map((pet, i) => (
            <motion.div
              key={pet.matchId}
              className="match-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 300, damping: 24 }}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
            >
              <div className="match-card-image">
                <img
                  src={pet.image}
                  alt={pet.name}
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Sin+foto'; }}
                />
                <div className="match-badge">✨ Match</div>
              </div>
              <div className="match-card-content">
                <h3 className="match-pet-name">{pet.name}</h3>
                <div className="match-pet-info">
                  <span className="info-item"><strong>Edad:</strong> {pet.age}</span>
                  <span className="info-item"><strong>Raza:</strong> {pet.breed}</span>
                  <span className="info-item"><strong>Dueño:</strong> {pet.ownerName}</span>
                </div>
                <div className="match-personality"><p>{pet.personality}</p></div>
                <div className="match-actions">
                  <button className="match-btn message-btn" onClick={() => handleSendMessage(pet)} title="Enviar mensaje">
                    <MessageCircle size={20} />
                    Enviar Mensaje
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Matches;
