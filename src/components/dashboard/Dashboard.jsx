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
import { petService } from '../../services/petService';
import { matchService } from '../../services/matchService';
import './Dashboard.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

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

  // Mascotas del usuario y la activa para hacer match
  const [myPets, setMyPets] = useState([]);
  const [activePetIdx, setActivePetIdx] = useState(0);
  const userPetId = myPets[activePetIdx]?.mascota_id ?? null;
  // Lista de mascotas potenciales mapeadas para PetCard
  const [potentialPets, setPotentialPets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadingPets, setLoadingPets] = useState(true);

  const loadPotentialMatches = useCallback(async (petId) => {
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
  }, []);

  // Cargar mascotas del usuario al montar
  useEffect(() => {
    const init = async () => {
      setLoadingPets(true);
      try {
        const pets = await petService.getMyPets();
        setMyPets(pets);
        if (pets.length > 0) {
          await loadPotentialMatches(pets[0].mascota_id);
        } else {
          setLoadingPets(false);
        }
      } catch {
        setLoadingPets(false);
      }
    };
    init();
  }, [loadPotentialMatches]);

  // Recargar matches cuando cambia la mascota activa
  const handleSelectPet = (idx) => {
    if (idx === activePetIdx) return;
    setActivePetIdx(idx);
    loadPotentialMatches(myPets[idx].mascota_id);
  };

  const handleSwipe = async (targetPetId, action) => {
    if (!userPetId) return;
    try {
      if (action === 'like') {
        const result = await matchService.likeMatch(userPetId, targetPetId);
        if (result.es_match) {
          toast.success('¡Es un match mutuo! 🎉', {
            icon: '🐾',
            style: { background: '#10b981', color: '#fff' },
            duration: 4000,
          });
        }
      } else {
        await matchService.passMatch(userPetId, targetPetId);
      }
    } catch {
      // match ya existente u otro error, continuamos
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const currentPet = currentIndex < potentialPets.length ? potentialPets[currentIndex] : null;

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
              <MyPets onPetChanged={() => userPetId && loadPotentialMatches(userPetId)} />
            </TabPane>
          ) : activeTab === 'settings' ? (
            <TabPane key="settings" style={{ padding: '40px' }}>
              <ProfileSettings />
            </TabPane>
          ) : activeTab === 'matches' ? (
            <TabPane key="matches" style={{ padding: '40px' }}>
              <Matches userPetId={userPetId} onOpenChat={() => setActiveTab('chats')} />
            </TabPane>
          ) : activeTab === 'chats' ? (
            <TabPane key="chats" style={{ padding: '0', height: '100%' }}>
              <ChatView />
            </TabPane>
          ) : (
            <TabPane key="home">
              <div className="dashboard-header">
                <h1>Descubre Mascotas</h1>
                <p>Encuentra el compañero de juegos perfecto para tu mascota</p>
              </div>

              {/* Selector de mascota activa */}
              {myPets.length > 0 && (
                <div className="pet-selector">
                  <span className="pet-selector-label">Matching con:</span>
                  <div className="pet-selector-list">
                    {myPets.map((pet, idx) => (
                      <button
                        key={pet.mascota_id}
                        className={`pet-selector-btn${idx === activePetIdx ? ' active' : ''}`}
                        onClick={() => handleSelectPet(idx)}
                        title={pet.nombre}
                      >
                        {pet.foto_url ? (
                          <img src={pet.foto_url} alt={pet.nombre} />
                        ) : (
                          <span className="pet-selector-icon">🐾</span>
                        )}
                        <span>{pet.nombre}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="dashboard-content">
                {loadingPets ? (
                  <div className="no-more-pets">
                    <div className="no-pets-icon">🐾</div>
                    <h2>Cargando mascotas...</h2>
                  </div>
                ) : !userPetId ? (
                  <div className="no-more-pets">
                    <div className="no-pets-icon">🐾</div>
                    <h2>Primero registra una mascota</h2>
                    <p>Ve a "Mis Mascotas" para agregar tu primera mascota y comenzar a hacer matches.</p>
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
    <MatchesProvider>
      <ChatProvider>
        <DashboardContent />
      </ChatProvider>
    </MatchesProvider>
  </ThemeProvider>
);

export default Dashboard;
