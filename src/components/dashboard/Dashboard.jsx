import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Heart, X } from 'lucide-react';
import Sidebar from './Sidebar';
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

/** Mapea una mascota cruda del endpoint /discover/ */
const mapDiscover = (m) => ({
  id: m.mascota_id,
  name: m.nombre,
  age: m.edad != null ? `${m.edad} ${m.edad === 1 ? 'año' : 'años'}` : '?',
  breed: m.raza || m.especie,
  image: m.foto_url || 'https://via.placeholder.com/300x300?text=🐾',
  ownerName: m.dueño_nombre || 'Usuario',
  personality: m.descripción || m.especie || '',
  likedMe: false,
  score: null,
});

/** Mapea un resultado del endpoint /potential/{id}/ */
const mapFiltered = (item) => {
  const m = item.mascota;
  return {
    id: m.mascota_id,
    name: m.nombre,
    age: m.edad != null ? `${m.edad} ${m.edad === 1 ? 'año' : 'años'}` : '?',
    breed: m.raza || m.especie,
    image: m.foto_url || 'https://via.placeholder.com/300x300?text=🐾',
    ownerName: m.dueño_nombre || 'Usuario',
    personality: m.descripción || m.especie || '',
    likedMe: item.liked_me || false,
    score: item.score,
  };
};

/* ── Tarjeta individual de la grilla ── */
const DiscoverCard = ({ pet, selectedPetId, onLike, onPass, index = 0 }) => {
  const [done, setDone] = useState(false);

  if (done) return null;

  const handleLike = async () => {
    if (!selectedPetId) {
      toast('Selecciona una de tus mascotas para dar like', { icon: '🐾' });
      return;
    }
    setDone(true);
    await onLike(pet.id);
  };

  const handlePass = () => {
    if (!selectedPetId) {
      toast('Selecciona una de tus mascotas para interactuar', { icon: '🐾' });
      return;
    }
    setDone(true);
    onPass(pet.id);
  };

  return (
    <motion.div
      className="match-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04, type: 'spring', stiffness: 300, damping: 24 }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
    >
      <div className="match-card-image">
        <img
          src={pet.image}
          alt={pet.name}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Sin+foto'; }}
        />
        {pet.likedMe && <div className="liked-me-badge">❤️ te dio like</div>}
        {pet.score != null && !pet.likedMe && (
          <div className="match-badge">{Math.round(pet.score * 100)}% compatible</div>
        )}
      </div>
      <div className="match-card-content">
        <h3 className="match-pet-name">{pet.name}</h3>
        <div className="match-pet-info">
          <span className="info-item"><strong>Edad:</strong> {pet.age}</span>
          <span className="info-item"><strong>Raza:</strong> {pet.breed}</span>
          <span className="info-item"><strong>Dueño:</strong> {pet.ownerName}</span>
        </div>
        {pet.personality && (
          <div className="match-personality"><p>{pet.personality}</p></div>
        )}
        <div className="match-actions">
          <button className="match-btn dc-pass-btn" onClick={handlePass} title="Pasar">
            <X size={18} /> Pasar
          </button>
          <button className="match-btn dc-like-btn" onClick={handleLike} title="Like">
            <Heart size={18} /> Like
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Variantes de animación para las pestañas ── */
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

/* ── Componente principal ── */
const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { theme } = useTheme();

  // Mascotas propias para el selector
  const [myPets, setMyPets] = useState([]);
  // Mascota activa en el selector (null = vista general)
  const [selectedPetId, setSelectedPetId] = useState(null);

  // Vista general: todas las mascotas de otros usuarios
  const [discoverPets, setDiscoverPets] = useState([]);
  const [discoverLoading, setDiscoverLoading] = useState(true);

  // Vista filtrada: coincidencias + likes para la mascota seleccionada
  const [filteredPets, setFilteredPets] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);

  // Cargar mis mascotas y la grilla general al montar
  const loadDiscover = useCallback(async () => {
    setDiscoverLoading(true);
    try {
      const [pets, all] = await Promise.all([
        petService.getMyPets(),
        petService.discoverPets(),
      ]);
      setMyPets(pets);
      setDiscoverPets(all.map(mapDiscover));
    } catch {
      setDiscoverPets([]);
    } finally {
      setDiscoverLoading(false);
    }
  }, []);

  useEffect(() => { loadDiscover(); }, [loadDiscover]);

  // Click en el selector: seleccionar o deseleccionar mascota
  const handleTogglePet = async (petId) => {
    if (selectedPetId === petId) {
      // Deseleccionar → volver a vista general
      setSelectedPetId(null);
      setFilteredPets([]);
      return;
    }
    setSelectedPetId(petId);
    setFilterLoading(true);
    try {
      const data = await matchService.getPotentialMatches(petId);
      setFilteredPets(data.map(mapFiltered));
    } catch {
      setFilteredPets([]);
    } finally {
      setFilterLoading(false);
    }
  };

  const handleLike = async (targetPetId) => {
    if (!selectedPetId) return;
    try {
      const result = await matchService.likeMatch(selectedPetId, targetPetId);
      if (result.es_match) {
        toast.success('¡Es un match mutuo! 🎉', {
          icon: '🐾',
          style: { background: '#10b981', color: '#fff' },
          duration: 4000,
        });
      }
      return result;
    } catch { /* ya interactuado, ignorar */ }
  };

  const handlePass = async (targetPetId) => {
    if (!selectedPetId) return;
    try {
      await matchService.passMatch(selectedPetId, targetPetId);
    } catch { /* ignorar */ }
  };

  const displayPets = selectedPetId ? filteredPets : discoverPets;
  const isLoading  = selectedPetId ? filterLoading : discoverLoading;
  const firstPetId = myPets[0]?.mascota_id ?? null;
  const selectedPet = myPets.find((p) => p.mascota_id === selectedPetId);

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
              <MyPets onPetChanged={loadDiscover} />
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
            <TabPane key="home" style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Header */}
              <div className="dashboard-header">
                <h1>Descubre Mascotas</h1>
                <p>
                  {selectedPetId
                    ? `Mostrando likes y coincidencias para ${selectedPet?.nombre ?? ''}`
                    : 'Vista general · Selecciona una de tus mascotas para filtrar'}
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

              {/* Grilla de mascotas */}
              <div className="discover-scroll">
                {isLoading ? (
                  <div className="no-more-pets">
                    <div className="no-pets-icon">🐾</div>
                    <h2>Cargando...</h2>
                  </div>
                ) : myPets.length === 0 ? (
                  <div className="no-more-pets">
                    <div className="no-pets-icon">🐾</div>
                    <h2>Primero registra una mascota</h2>
                    <p>Ve a "Mis Mascotas" para agregar tu primera mascota y comenzar a hacer matches.</p>
                  </div>
                ) : displayPets.length === 0 ? (
                  <div className="no-more-pets">
                    <div className="no-pets-icon">🐾</div>
                    <h2>{selectedPetId ? 'Sin coincidencias por ahora' : 'No hay mascotas aún'}</h2>
                    <p>{selectedPetId ? 'Vuelve más tarde, o prueba con otra mascota tuya.' : 'Registra tu mascota e invita a otros usuarios.'}</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    <div className="discover-grid">
                      {displayPets.map((pet, i) => (
                        <DiscoverCard
                          key={pet.id}
                          pet={pet}
                          index={i}
                          selectedPetId={selectedPetId}
                          onLike={handleLike}
                          onPass={handlePass}
                        />
                      ))}
                    </div>
                  </AnimatePresence>
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
