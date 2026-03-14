import { Edit2, Trash2 } from 'lucide-react';
import './PetProfileCard.css';

const PetProfileCard = ({ pet, onEdit, onDelete }) => {
  return (
    <div className="pet-profile-card">
      <div className="pet-profile-image">
        <img src={pet.photo} alt={pet.name} />
      </div>
      
      <div className="pet-profile-content">
        <div className="pet-profile-header">
          <h3 className="pet-profile-name">{pet.name}</h3>
          <div className="pet-profile-actions">
            <button 
              className="pet-action-btn edit-btn" 
              onClick={() => onEdit(pet)}
              title="Editar mascota"
            >
              <Edit2 size={18} />
            </button>
            <button 
              className="pet-action-btn delete-btn" 
              onClick={() => onDelete(pet.id)}
              title="Eliminar mascota"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="pet-profile-info">
          <div className="info-item">
            <span className="info-label">Tipo:</span>
            <span className="info-value">{pet.type}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Raza:</span>
            <span className="info-value">{pet.breed}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Edad:</span>
            <span className="info-value">{pet.age} años</span>
          </div>
        </div>

        <div className="pet-profile-traits">
          <span className="traits-label">Personalidad:</span>
          <div className="traits-list">
            {pet.characteristics.map((trait, index) => (
              <span key={index} className="trait-tag">
                {trait}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfileCard;
