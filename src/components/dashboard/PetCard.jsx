import { X, Heart } from 'lucide-react';
import { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useMatches } from '../../context/MatchesContext';
import toast from 'react-hot-toast';
import './PetCard.css';

const PetCard = ({ pet, onSwipe }) => {
  const [exitX, setExitX] = useState(0);
  const { addMatch } = useMatches();
  
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleReject = () => {
    // Animación de shake antes de deslizar
    const cardElement = document.querySelector('.pet-card');
    if (cardElement) {
      cardElement.style.animation = 'shake 0.3s ease';
      setTimeout(() => {
        cardElement.style.animation = '';
      }, 300);
    }
    
    setExitX(-300);
    toast.error(`${pet.name} rechazado`, {
      icon: '❌',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    setTimeout(() => {
      onSwipe && onSwipe(pet.id, 'reject');
    }, 300);
  };

  const handleLike = () => {
    // Animación de pulse antes de deslizar
    const cardElement = document.querySelector('.pet-card');
    if (cardElement) {
      cardElement.style.animation = 'pulse 0.4s ease';
      setTimeout(() => {
        cardElement.style.animation = '';
      }, 400);
    }
    
    setExitX(300);
    addMatch(pet);
    toast.success(`¡Match con ${pet.name}! 💕`, {
      icon: '❤️',
      style: {
        borderRadius: '10px',
        background: '#10b981',
        color: '#fff',
      },
      duration: 3000,
    });
    setTimeout(() => {
      onSwipe && onSwipe(pet.id, 'like');
    }, 300);
  };

  return (
    <motion.div 
      className="pet-card"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      animate={exitX !== 0 ? { x: exitX } : {}}
      transition={{ duration: 0.3 }}
    >
      <div className="pet-card-image">
        <img src={pet.image} alt={pet.name} />
        
        {/* Indicadores de swipe */}
        <motion.div 
          className="swipe-indicator reject-indicator"
          style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
        >
          <X size={60} />
        </motion.div>
        
        <motion.div 
          className="swipe-indicator like-indicator"
          style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
        >
          <Heart size={60} />
        </motion.div>
      </div>

      <div className="pet-card-content">
        <div className="pet-header">
          <h2 className="pet-name">{pet.name}</h2>
          {pet.distance && (
            <span className="pet-distance">📍 {pet.distance} km</span>
          )}
        </div>
        
        <div className="pet-info">
          <span>Edad: {pet.age}</span>
          <span className="separator">|</span>
          <span>Raza: {pet.breed}</span>
          <span className="separator">|</span>
          <span>Ubicación: {pet.location}</span>
        </div>

        <div className="pet-personality">
          <p>{pet.personality}</p>
        </div>

        <div className="pet-actions">
          <button 
            className="action-btn skip-btn" 
            onClick={handleReject}
            aria-label="Rechazar"
          >
            <X size={28} />
          </button>
          
          <button 
            className="action-btn like-btn"
            onClick={handleLike}
            aria-label="Me gusta"
          >
            <Heart size={28} />
          </button>
        </div>

        <div className="pet-details">
          <p>{pet.details}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default PetCard;
