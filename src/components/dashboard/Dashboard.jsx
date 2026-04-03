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
import { matchService } from '../../services/matchService';
import './Dashboard.css';

/** Convierte una mascota del backend al formato que espera PetCard */
const mapPetForCard = (item) => {
  const m = item.mascota;
  const image = m.foto_url || 'https://via.placeholder.com/400x300?text=Sin+foto';
  return {
    id: m.mascota_id,
    name: m.nombre,
    age: m.edad != null ? `${m.edad} ${m.edad === 1 ? 'año' : 'años'}` : '?',
    breed: m.raza || m.especie,
    location: 'Cerca de ti',
    distance: item.distancia_km ?? null,
    personality: m.descripción || m.especie,
    details: `Dueño: ${m.dueño_nombre || 'Desconocido'} · Score: ${Math.round(item.score * 100)}%`,
    image,
    likedMe: item.liked_me || false,
  };
};

const tabVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

const TabPane = ({ children, style }) => (
  <motion.div
    className="dashboard-content-wrapper"
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

  // Vista general: resumen de mascotas del usuario
  const [petsOverview, setPetsOverview] = useState([]);
  const [overviewLoading, setOverviewLoading] = useState(true);

  // Mascota seleccionada para hacer swipe (null = vista general)
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [selectedPetName, setSelectedPetName] = useState('');

  // Mascotas potenciales para el swipe
  const [potentialPets, setPotentialPets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingPets, setLoadingPets] = useState(false);

  const loadOverview = useCallback(async () => {
    setOverviewLoading(true);
    try {
      const data = await matchService.getPetsOverview();
      setPetsOverview(data);
    } catch {
      setPetsOverview([]);
    } finally {
      setOverviewLoading(false);
    }
  }, []);

  useEffect(() => { loadOverview(); }, [loadOverview]);

  const handleSelectPet = async (petId, petName) => {
    setSelectedPetId(petId);
    setSelectedPetName(petName);
    setLoadingPets(true);
    try {
      const data = await matchService.getPotentialMatches(petId);
      setPotentialPets(data.map(mapPetForCard));
      setCurrentIndex(0);
    } catch {
      setPotentialPets([]);
    } finally {
      setLoadingPets(false);
    }
  };

  const handleBackToOverview = () => {
    setSelectedPetId(null);
    setSelectedPetName('');
    setPotentialPets([]);
    loadOverview(); // refresca conteos
  };

  const handleSwipe = async (targetPetId, action) => {
    if (!selectedPetId) return;
    try {
      if (action === 'like') {
        const result = await matchService.likeMatch(selectedPetId, targetPetId);
        if (result.es_match) {
          toast.success('¡Es un match mutuo! 🎉', {
            icon: '🐾',
            style: { background: '#10b981', color: '#fff' },
            duration: 4000,
          });
        }
      } else {
        await matchService.passMatch(selectedPetId, targetPetId);
      }
    } catch {
      // match ya existente u otro error, continuamos
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const currentPet = currentIndex < potentialPets.length ? potentialPets[currentIndex] : null;
  const firstPetId = petsOverview[0]?.mascota_id ?? null;

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
            <TabPane key="pets" style={{ padding: '40px' }}>
              <MyPets onPetChanged={loadOverview} />
            </TabPane>
          ) : activeTab === 'settings' ? (
            <TabPane key="settings" style={{ padding: '40px' }}>
              <ProfileSettings />
            </TabPane>
          ) : activeTab === 'matches' ? (
            <TabPane key="matches" style={{ padding: '40px' }}>
              <Matches userPetId={firstPetId} onOpenChat={() => setActiveTab('chats')} />
            </TabPane>
          ) : activeTab === 'chats' ? (
            <TabPane key="chats" style={{ padding: '0', height: '100%' }}>
              <ChatView />
            </TabPane>
          ) : (
            <TabPane key="home">
              {!selectedPetId ? (
                /* ── VISTA GENERAL ── */
                <>
                  <div className="dashboard-header">
                    <h1>Descubre Mascotas</h1>
                    <p>Selecciona una de tus mascotas para ver quién le dio like y sus mejores coincidencias</p>
                  </div>
                  <div className="dashboard-content">
                    {overviewLoading ? (
                      <div className="no-more-pets">
                        <div className="no-pets-icon">🐾</div>
                        <h2>Cargando...</h2>
                      </div>
                    ) : petsOverview.length === 0 ? (
                      <div className="no-more-pets">
                        <div className="no-pets-icon">🐾</div>
                        <h2>Primero registra una mascota</h2>
                        <p>Ve a "Mis Mascotas" para agregar tu primera mascota y comenzar a hacer matches.</p>
                      </div>
                    ) : (
                      <div className="pets-overview-grid">
                        {petsOverview.map((pet) => (
                          <motion.button
                            key={pet.mascota_id}
                            className="overview-pet-card"
                            onClick={() => handleSelectPet(pet.mascota_id, pet.nombre)}
                            whileHover={{ y: -6, transition: { duration: 0.15 } }}
                            whileTap={{ scale: 0.97 }}
                          >
                            <div className="overview-pet-photo">
                              {pet.foto_url ? (
                                <img
                                  src={pet.foto_url}
                                  alt={pet.nombre}
                                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x300?text=🐾'; }}
                                />
                              ) : (
                                <div className="overview-pet-no-photo">🐾</div>
                              )}
                              {pet.likes_pendientes > 0 && (
                                <span className="overview-likes-badge">
                                  ❤️ {pet.likes_pendientes}
                                </span>
                              )}
                            </div>
                            <div className="overview-pet-info">
                              <h3>{pet.nombre}</h3>
                              <p>{pet.especie}{pet.raza ? ` · ${pet.raza}` : ''}{pet.edad != null ? ` · ${pet.edad} años` : ''}</p>
                              <div className="overview-pet-stats">
                                {pet.likes_pendientes > 0 && (
                                  <span className="stat-likes">❤️ {pet.likes_pendientes} {pet.likes_pendientes === 1 ? 'like' : 'likes'}</span>
                                )}
                                {pet.matches_aceptados > 0 && (
                                  <span className="stat-matches">✨ {pet.matches_aceptados} {pet.matches_aceptados === 1 ? 'match' : 'matches'}</span>
                                )}
                                {pet.likes_pendientes === 0 && pet.matches_aceptados === 0 && (
                                  <span className="stat-empty">Ver coincidencias</span>
                                )}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* ── MODO SWIPE ── */
                <>
                  <div className="dashboard-header swipe-header">
                    <button className="back-to-overview" onClick={handleBackToOverview}>
                      ← Mis mascotas
                    </button>
                    <div>
                      <h1>Descubre para <span className="active-pet-name">{selectedPetName}</span></h1>
                      <p>{potentialPets.length > 0 ? `${potentialPets.length} mascotas disponibles` : 'No hay más por ahora'}</p>
                    </div>
                  </div>
                  <div className="dashboard-content">
                    {loadingPets ? (
                      <div className="no-more-pets">
                        <div className="no-pets-icon">🐾</div>
                        <h2>Cargando mascotas...</h2>
                      </div>
                    ) : currentPet ? (
                      <PetCard key={currentPet.id} pet={currentPet} onSwipe={handleSwipe} />
                    ) : (
                      <div className="no-more-pets">
                        <div className="no-pets-icon">🐾</div>
                        <h2>No hay más mascotas por ahora</h2>
                        <p>Vuelve más tarde para ver nuevas sugerencias</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </TabPane>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {activeTab !== 'pets' && activeTab !== 'settings' && activeTab !== 'matches' && activeTab !== 'chats' && !selectedPetId && (
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
    <MatchesProvider>
      <ChatProvider>
        <DashboardContent />
      </ChatProvider>
    </MatchesProvider>
  </ThemeProvider>
);

export default Dashboard;
