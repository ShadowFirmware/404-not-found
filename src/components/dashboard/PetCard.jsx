import { X, Heart } from 'lucide-react';
import { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import toast from 'react-hot-toast';
import './PetCard.css';

const SWIPE_THRESHOLD = 100; // px necesarios para que cuente como swipe

const PetCard = ({ pet, onSwipe }) => {
  const [gone, setGone] = useState(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const opacity = useTransform(x, [-250, -100, 0, 100, 250], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const rejectOpacity = useTransform(x, [-100, -20], [1, 0]);

  const flyOut = (direction, action) => {
    if (gone) return;
    setGone(true);
    const target = direction === 'like' ? 600 : -600;

    animate(x, target, {
      type: 'tween',
      duration: 0.3,
      onComplete: () => onSwipe && onSwipe(pet.id, action),
    });

    if (action === 'like') {
      toast.success(`¡Like enviado a ${pet.name}!`, {
        icon: '❤️',
        style: { borderRadius: '10px', background: '#10b981', color: '#fff' },
        duration: 2000,
      });
    } else {
      toast(`${pet.name} omitido`, {
        icon: '❌',
        style: { borderRadius: '10px', background: '#333', color: '#fff' },
        duration: 1500,
      });
    }
  };

  const handleDragEnd = (_, info) => {
    if (info.offset.x > SWIPE_THRESHOLD) {
      flyOut('like', 'like');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      flyOut('reject', 'reject');
    } else {
      // No llegó al umbral — volver al centro
      animate(x, 0, { type: 'spring', stiffness: 300, damping: 25 });
    }
  };

  return (
    <motion.div
      className="pet-card"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: -300, right: 300 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      whileDrag={{ cursor: 'grabbing' }}
    >
      <div className="pet-card-image">
        <img
          src={pet.image}
          alt={pet.name}
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x300?text=Sin+foto'; }}
        />

        {pet.likedMe && (
          <div className="liked-me-badge">❤️ Ya te dio like</div>
        )}

        {(pet.distance != null || pet.location) && (
          <div className="distance-badge">
            📍 {pet.distance != null ? `${pet.distance} km` : pet.location}
          </div>
        )}

        <motion.div className="swipe-indicator reject-indicator" style={{ opacity: rejectOpacity }}>
          <X size={60} />
        </motion.div>
        <motion.div className="swipe-indicator like-indicator" style={{ opacity: likeOpacity }}>
          <Heart size={60} />
        </motion.div>
      </div>

      <div className="pet-card-content">
        <div className="pet-header">
          <h2 className="pet-name">{pet.name}</h2>
        </div>

        <div className="pet-info">
          <span>Edad: {pet.age}</span>
          <span className="separator">|</span>
          <span>Raza: {pet.breed}</span>
          <span className="separator">|</span>
          <span>{pet.location}</span>
        </div>

        <div className="pet-personality">
          <p>{pet.personality}</p>
        </div>

        <div className="pet-actions">
          <button
            className="action-btn skip-btn"
            onClick={() => flyOut('reject', 'reject')}
            disabled={gone}
            aria-label="Rechazar"
          >
            <X size={28} />
          </button>
          <button
            className="action-btn like-btn"
            onClick={() => flyOut('like', 'like')}
            disabled={gone}
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
