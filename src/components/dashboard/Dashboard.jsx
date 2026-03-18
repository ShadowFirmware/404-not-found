import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
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
import './Dashboard.css';

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { theme } = useTheme();

  // Debug: monitorear cambios en currentIndex
  useEffect(() => {
    console.log('🔄 currentIndex cambió a:', currentIndex);
  }, [currentIndex]);

  // TODO BACKEND: El algoritmo de sugerencias debe considerar:
  // 1. DISTANCIA: Calcular distancia entre coordenadas del usuario y las mascotas
  // 2. CARACTERÍSTICAS: Match de personalidad/características compatibles
  // 3. MATCH MUTUO: Un match solo se guarda cuando AMBOS usuarios dan like
  //    - Usuario A da like a mascota de Usuario B -> Se guarda como "pending_match"
  //    - Usuario B da like a mascota de Usuario A -> Se convierte en "confirmed_match"
  //    - Solo los "confirmed_match" aparecen en la sección de Matches
  
  // Mock data para mascotas sugeridas (ordenadas por distancia)
  const mockPets = [
    {
      id: 1,
      name: 'Buddy',
      age: '2 años',
      breed: 'Golden Retriever',
      location: 'San Francisco',
      distance: 0.8, // km - TODO BACKEND: Calcular con geolocalización
      personality: 'Amigable, Energético, Le encanta jugar',
      details: 'A Buddy le encanta hacer senderismo y es muy sociable con otros perros. Tiene debilidad por los juguetes que suenan y disfruta acurrucarse en el sofá.',
      image: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      name: 'Luna',
      age: '1 año',
      breed: 'Husky Siberiano',
      location: 'Los Angeles',
      distance: 1.2, // km
      personality: 'Juguetona, Curiosa, Muy activa',
      details: 'Luna adora correr en el parque y jugar con otros perros. Es muy amigable y le encanta la nieve.',
      image: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      name: 'Max',
      age: '3 años',
      breed: 'Labrador',
      location: 'Miami',
      distance: 2.5, // km
      personality: 'Tranquilo, Cariñoso, Protector',
      details: 'Max es un perro muy leal y le encanta nadar. Perfecto para familias con niños.',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop'
    },
    {
      id: 4,
      name: 'Bella',
      age: '2 años',
      breed: 'Beagle',
      location: 'Nueva York',
      distance: 3.1, // km
      personality: 'Curiosa, Amigable, Juguetona',
      details: 'Bella adora explorar y seguir rastros. Es muy sociable y le encanta conocer gente nueva.',
      image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&h=600&fit=crop'
    },
    {
      id: 5,
      name: 'Rocky',
      age: '4 años',
      breed: 'Bulldog Francés',
      location: 'Chicago',
      distance: 4.5, // km
      personality: 'Relajado, Cariñoso, Divertido',
      details: 'Rocky es un compañero perfecto para el sofá. Le encanta dormir siestas y recibir mimos.',
      image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&h=600&fit=crop'
    },
    {
      id: 6,
      name: 'Coco',
      age: '1 año',
      breed: 'Pomerania',
      location: 'Boston',
      distance: 5.2, // km
      personality: 'Energética, Alegre, Pequeña pero valiente',
      details: 'Coco es una bolita de energía. Le encanta jugar y ser el centro de atención.',
      image: 'https://images.unsplash.com/photo-1629965844385-6b9e0e3f77e3?w=800&h=600&fit=crop'
    },
    {
      id: 7,
      name: 'Zeus',
      age: '5 años',
      breed: 'Pastor Alemán',
      location: 'Seattle',
      distance: 6.8, // km
      personality: 'Inteligente, Leal, Protector',
      details: 'Zeus es un perro muy entrenado y obediente. Perfecto para actividades al aire libre.',
      image: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&h=600&fit=crop'
    },
    {
      id: 8,
      name: 'Mia',
      age: '2 años',
      breed: 'Shih Tzu',
      location: 'Austin',
      distance: 7.3, // km
      personality: 'Dulce, Tranquila, Cariñosa',
      details: 'Mia es perfecta para apartamentos. Le encanta acurrucarse y ver películas.',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop'
    },
    {
      id: 9,
      name: 'Charlie',
      age: '3 años',
      breed: 'Corgi',
      location: 'Portland',
      distance: 8.9, // km
      personality: 'Juguetón, Inteligente, Sociable',
      details: 'Charlie adora jugar a buscar la pelota. Es muy amigable con otros perros y niños.',
      image: 'https://images.unsplash.com/photo-1612536616123-870f8c5e7c2f?w=800&h=600&fit=crop'
    },
    {
      id: 10,
      name: 'Daisy',
      age: '1 año',
      breed: 'Dálmata',
      location: 'Denver',
      distance: 10.5, // km
      personality: 'Activa, Juguetona, Aventurera',
      details: 'Daisy necesita mucho ejercicio. Le encanta correr y jugar al aire libre.',
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=600&fit=crop'
    },
    {
      id: 11,
      name: 'Duke',
      age: '4 años',
      breed: 'Boxer',
      location: 'Phoenix',
      distance: 12.1, // km
      personality: 'Energético, Protector, Leal',
      details: 'Duke es un guardián natural pero muy cariñoso con su familia. Le encanta jugar.',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=600&fit=crop'
    },
    {
      id: 12,
      name: 'Lola',
      age: '2 años',
      breed: 'Chihuahua',
      location: 'San Diego',
      distance: 14.7, // km
      personality: 'Valiente, Cariñosa, Pequeña',
      details: 'Lola tiene una gran personalidad en un cuerpo pequeño. Le encanta estar en brazos.',
      image: 'https://images.unsplash.com/photo-1612195583950-b8fd34c87093?w=800&h=600&fit=crop'
    },
    {
      id: 13,
      name: 'Cooper',
      age: '3 años',
      breed: 'Border Collie',
      location: 'Nashville',
      distance: 16.2, // km
      personality: 'Muy inteligente, Activo, Obediente',
      details: 'Cooper es extremadamente inteligente y le encanta aprender trucos nuevos.',
      image: 'https://images.unsplash.com/photo-1568393691622-c7ba131d63b4?w=800&h=600&fit=crop'
    },
    {
      id: 14,
      name: 'Sadie',
      age: '2 años',
      breed: 'Cocker Spaniel',
      location: 'Atlanta',
      distance: 18.5, // km
      personality: 'Dulce, Gentil, Cariñosa',
      details: 'Sadie es una compañera perfecta. Le encanta dar paseos tranquilos y recibir caricias.',
      image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=800&h=600&fit=crop'
    },
    {
      id: 15,
      name: 'Bear',
      age: '5 años',
      breed: 'Akita',
      location: 'Las Vegas',
      distance: 22.3, // km
      personality: 'Tranquilo, Leal, Protector',
      details: 'Bear es un perro majestuoso y calmado. Perfecto para familias que buscan un guardián.',
      image: 'https://images.unsplash.com/photo-1611003228941-98852ba62227?w=800&h=600&fit=crop'
    },
    {
      id: 16,
      name: 'Oliver',
      age: '2 años',
      breed: 'Schnauzer',
      location: 'Dallas',
      distance: 1.5, // km
      personality: 'Alerta, Amigable, Inteligente',
      details: 'Oliver es un perro muy observador y le encanta estar con su familia. Excelente compañero.',
      image: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&h=600&fit=crop'
    },
    {
      id: 17,
      name: 'Nala',
      age: '1 año',
      breed: 'Pitbull',
      location: 'Houston',
      distance: 3.8, // km
      personality: 'Cariñosa, Juguetona, Protectora',
      details: 'Nala es muy dulce y le encanta jugar con niños. Desmiente todos los estereotipos.',
      image: 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=800&h=600&fit=crop'
    },
    {
      id: 18,
      name: 'Toby',
      age: '4 años',
      breed: 'Yorkshire Terrier',
      location: 'San Antonio',
      distance: 6.2, // km
      personality: 'Valiente, Cariñoso, Enérgico',
      details: 'Toby es pequeño pero tiene un gran corazón. Le encanta ser el centro de atención.',
      image: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=800&h=600&fit=crop'
    },
    {
      id: 19,
      name: 'Rosie',
      age: '3 años',
      breed: 'Pug',
      location: 'San Jose',
      distance: 9.4, // km
      personality: 'Divertida, Sociable, Dormilona',
      details: 'Rosie adora las siestas y los snacks. Es perfecta para un estilo de vida relajado.',
      image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&h=600&fit=crop'
    },
    {
      id: 20,
      name: 'Thor',
      age: '2 años',
      breed: 'Rottweiler',
      location: 'Columbus',
      distance: 15.7, // km
      personality: 'Fuerte, Leal, Protector',
      details: 'Thor es un guardián natural pero muy cariñoso con su familia. Le encanta el ejercicio.',
      image: 'https://images.unsplash.com/photo-1567752881298-894bb81f9379?w=800&h=600&fit=crop'
    }
  ];

  const handleSwipe = (petId, action) => {
    console.log(`🎯 Swipe ${action} en mascota:`, petId);
    console.log(`📊 Índice ANTES:`, currentIndex);
    console.log(`📚 Total mascotas:`, mockPets.length);
    
    // Avanzar al siguiente índice
    const nextIndex = currentIndex + 1;
    console.log(`➡️ Próximo índice:`, nextIndex);
    setCurrentIndex(nextIndex);
  };

  // Obtener la mascota actual basada en el índice
  const currentPet = currentIndex < mockPets.length ? mockPets[currentIndex] : null;

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
        '--hover-color': theme.hover
      }}
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="dashboard-main">
        {activeTab === 'pets' ? (
          <div className="dashboard-content" style={{ padding: '40px' }}>
            <MyPets />
          </div>
        ) : activeTab === 'settings' ? (
          <div className="dashboard-content" style={{ padding: '40px' }}>
            <ProfileSettings />
          </div>
        ) : activeTab === 'matches' ? (
          <div className="dashboard-content" style={{ padding: '40px' }}>
            <Matches onOpenChat={() => setActiveTab('chats')} />
          </div>
        ) : activeTab === 'chats' ? (
          <div className="dashboard-content" style={{ padding: '0' }}>
            <ChatView />
          </div>
        ) : (
          <>
            <div className="dashboard-header">
              <h1>Descubre Mascotas</h1>
              <p>Encuentra el compañero de juegos perfecto para tu mascota</p>
            </div>
            
            <div className="dashboard-content">
              {currentPet ? (
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
      </div>

      {activeTab !== 'pets' && activeTab !== 'settings' && activeTab !== 'matches' && activeTab !== 'chats' && (
        <div className="dashboard-sidebar">
          <StatsPanel />
          <ActivityFeed />
        </div>
      )}
      
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '15px',
            fontWeight: '500',
          },
        }}
      />
    </div>
  );
};

const Dashboard = () => {
  return (
    <ThemeProvider>
      <MatchesProvider>
        <ChatProvider>
          <DashboardContent />
        </ChatProvider>
      </MatchesProvider>
    </ThemeProvider>
  );
};

export default Dashboard;
