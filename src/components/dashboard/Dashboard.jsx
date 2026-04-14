import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import Sidebar from './Sidebar';
import PetCard from './PetCard';
import StatsPanel from './StatsPanel';
import ActivityFeed from './ActivityFeed';
import MyPets from './MyPets';
import ProfileSettings from './ProfileSettings';
import Matches from './Matches';
import ChatView from '../chat/ChatView';
import { ThemeProvider, useTheme } from '../../context/ThemeContext';
import { MatchesProvider } from '../../context/MatchesContext';
import { ChatProvider } from '../../context/ChatContext';
import { RefreshProvider, useRefresh } from '../../context/RefreshContext';
import { petService } from '../../services/petService';
import { matchService } from '../../services/matchService';
import './Dashboard.css';

/** Mapea mascota cruda del endpoint /discover/ al formato de PetCard */
const mapDiscover = (m) => ({
  id: m.mascota_id,
  name: m.nombre,
  age: m.edad != null ? `${m.edad} ${m.edad === 1 ? 'año' : 'años'}` : '?',
  breed: m.raza || m.especie,
  location: 'Cerca de ti',
  distance: null,
  personality: m.descripción || m.especie || '',
  details: `Dueño: ${m.dueño_nombre || 'Desconocido'}`,
  image: m.foto_url || 'https://via.placeholder.com/400x300?text=Sin+foto',
  likedMe: false,
});

/** Mapea resultado del endpoint /potential/{id}/ al formato de PetCard */
const mapFiltered = (item) => {
  const m = item.mascota;
  return {
    id: m.mascota_id,
    name: m.nombre,
    age: m.edad != null ? `${m.edad} ${m.edad === 1 ? 'año' : 'años'}` : '?',
    breed: m.raza || m.especie,
    location: 'Cerca de ti',
    distance: item.distancia_km ?? null,
    personality: m.descripción || m.especie || '',
    details: `Dueño: ${m.dueño_nombre || 'Desconocido'} · Score: ${Math.round(item.score * 100)}%`,
    image: m.foto_url || 'https://via.placeholder.com/400x300?text=Sin+foto',
    likedMe: item.liked_me || false,
  };
};

const tabVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const TabPane = ({ children, style, noScroll = false }) => (
  <motion.div
    className={`dashboard-content-wrapper${noScroll ? ' no-scroll' : ''}`}
    variants={tabVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ width: '100%', height: '100%', ...style }}
  >
    {children}
  </motion.div>
);

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { theme } = useTheme();
  const { triggerRefresh } = useRefresh();

  // Mascotas propias para el selector
  const [myPets, setMyPets] = useState([]);
  // Mascota activa en el selector (null = vista general)
  const [selectedPetId, setSelectedPetId] = useState(null);

  // Cola de tarjetas y posición actual
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Carga inicial: mis mascotas + todas las mascotas (vista general)
  const loadMyPetsAndDiscover = useCallback(async () => {
    setLoading(true);
    try {
      const [pets, all] = await Promise.all([
        petService.getMyPets(),
        petService.discoverPets(),
      ]);
      setMyPets(pets);
      setCards(all.map(mapDiscover));
      setCurrentIndex(0);
    } catch {
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMyPetsAndDiscover(); }, [loadMyPetsAndDiscover]);

  // Toggle del selector: seleccionar o deseleccionar mascota
  const handleTogglePet = async (petId) => {
    if (selectedPetId === petId) {
      // Deseleccionar → volver a vista general
      setSelectedPetId(null);
      setLoading(true);
      try {
        const all = await petService.discoverPets();
        setCards(all.map(mapDiscover));
        setCurrentIndex(0);
      } catch { setCards([]); }
      finally { setLoading(false); }
      return;
    }

    setSelectedPetId(petId);
    setLoading(true);
    try {
      const data = await matchService.getPotentialMatches(petId);
      setCards(data.map(mapFiltered));
      setCurrentIndex(0);
    } catch { setCards([]); }
    finally { setLoading(false); }
  };

  const handleSwipe = async (targetPetId, action) => {
    if (action === 'like') {
      if (!selectedPetId) {
        toast('Selecciona una de tus mascotas para dar like', { icon: '🐾' });
        return;
      }
      try {
        const result = await matchService.likeMatch(selectedPetId, targetPetId);
        if (result.es_match) {
          toast.success('¡Es un match mutuo! 🎉', {
            icon: '🐾',
            style: { background: '#10b981', color: '#fff' },
            duration: 4000,
          });
          // Match nuevo → actualizar stats + actividad + lista de matches
          triggerRefresh('stats');
          triggerRefresh('activity');
          triggerRefresh('matches');
        } else {
          // Like enviado → puede aumentar likes_recibidos en el otro usuario;
          // aquí solo refrescamos actividad local por si hay cambios
          triggerRefresh('activity');
        }
      } catch { /* ignorar duplicados */ }
    } else {
      if (selectedPetId) {
        try { await matchService.passMatch(selectedPetId, targetPetId); } catch { /* ignorar */ }
      }
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const currentCard = currentIndex < cards.length ? cards[currentIndex] : null;
  const firstPetId  = myPets[0]?.mascota_id ?? null;

  return (
    <div
      className="dashboard"
      style={{
        '--primary-color': theme.primary,
        '--background-color': theme.background,
        '--card-bg': theme.cardBg,
        '--text-color': theme.text,
        '--text-secondary': theme.textSecondary,
        '--border-color': theme.border,
        '--hover-color': theme.hover,
      }}
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="dashboard-main">
        <AnimatePresence mode="wait">
          {activeTab === 'pets' ? (
            <TabPane key="pets">
              <MyPets onPetChanged={loadMyPetsAndDiscover} />
            </TabPane>
          ) : activeTab === 'settings' ? (
            <TabPane key="settings">
              <ProfileSettings />
            </TabPane>
          ) : activeTab === 'matches' ? (
            <TabPane key="matches">
              <Matches userPetId={firstPetId} onOpenChat={() => setActiveTab('chats')} />
            </TabPane>
          ) : activeTab === 'chats' ? (
            <TabPane key="chats" style={{ padding: '0', height: '100%' }} noScroll>
              <ChatView />
            </TabPane>
          ) : (
            <TabPane key="home">
              <div className="dashboard-header">
                <h1>Descubre Mascotas</h1>
                <p>
                  {selectedPetId
                    ? `Mostrando coincidencias para ${myPets.find(p => p.mascota_id === selectedPetId)?.nombre ?? ''}`
                    : 'Vista general · Selecciona una mascota tuya para filtrar'}
                </p>
              </div>

              {/* Selector de mis mascotas */}
              {myPets.length > 0 && (
                <div className="pet-selector">
                  <span className="pet-selector-label">Filtrar con:</span>
                  <div className="pet-selector-list">
                    {myPets.map((pet) => (
                      <button
                        key={pet.mascota_id}
                        className={`pet-selector-btn${selectedPetId === pet.mascota_id ? ' active' : ''}`}
                        onClick={() => handleTogglePet(pet.mascota_id)}
                        title={selectedPetId === pet.mascota_id ? 'Click para quitar filtro' : pet.nombre}
                      >
                        {pet.foto_url
                          ? <img src={pet.foto_url} alt={pet.nombre} onError={(e) => { e.target.style.display = 'none'; }} />
                          : <span className="pet-selector-icon">🐾</span>
                        }
                        <span>{pet.nombre}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="dashboard-content">
                {loading ? (
                  <div className="no-more-pets">
                    <div className="no-pets-icon">🐾</div>
                    <h2>Cargando mascotas...</h2>
                  </div>
                ) : myPets.length === 0 ? (
                  <div className="no-more-pets">
                    <div className="no-pets-icon">🐾</div>
                    <h2>Primero registra una mascota</h2>
                    <p>Ve a "Mis Mascotas" para agregar tu primera mascota y comenzar a hacer matches.</p>
                  </div>
                ) : currentCard ? (
                  <PetCard key={currentCard.id} pet={currentCard} onSwipe={handleSwipe} />
                ) : (
                  <div className="no-more-pets">
                    <div className="no-pets-icon">🐾</div>
                    <h2>No hay más mascotas por ahora</h2>
                    <p>Vuelve más tarde para ver nuevas sugerencias.</p>
                  </div>
                )}
              </div>
            </TabPane>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeTab !== 'pets' && activeTab !== 'settings' && activeTab !== 'matches' && activeTab !== 'chats' && (
          <motion.div
            className="dashboard-sidebar"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <StatsPanel />
            <ActivityFeed setActiveTab={setActiveTab} />
          </motion.div>
        )}
      </AnimatePresence>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff', fontSize: '15px', fontWeight: '500' },
        }}
      />
    </div>
  );
};

const Dashboard = () => (
  <ThemeProvider>
    <RefreshProvider>
      <MatchesProvider>
        <ChatProvider>
          <DashboardContent />
        </ChatProvider>
      </MatchesProvider>
    </RefreshProvider>
  </ThemeProvider>
);

export default Dashboard;
