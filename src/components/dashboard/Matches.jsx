import { Trash2, MessageCircle } from 'lucide-react';
import { useMatches } from '../../context/MatchesContext';
import { useChat } from '../../context/ChatContext';
import toast from 'react-hot-toast';
import './Matches.css';

// TODO BACKEND: Sistema de Match Mutuo
// =====================================
// Un match solo aparece aquí cuando AMBOS usuarios han dado like:
// 
// Flujo:
// 1. Usuario A da like a mascota de Usuario B
//    -> Backend guarda como "pending_match" (status: pending)
// 2. Usuario B da like a mascota de Usuario A  
//    -> Backend actualiza a "confirmed_match" (status: confirmed)
// 3. Solo los matches con status "confirmed" se muestran en esta sección
//
// Endpoints necesarios:
// - GET /matches/confirmed/ -> Retorna solo matches mutuos confirmados
// - DELETE /matches/:matchId/ -> Eliminar un match

const Matches = ({ onOpenChat }) => {
  const { matches, removeMatch } = useMatches();
  const { createConversation } = useChat();

  const handleRemoveMatch = (petId, petName) => {
    toast((t) => (
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 12px 0', fontWeight: '600' }}>
          ¿Eliminar match con {petName}?
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => {
              removeMatch(petId);
              toast.success(`Match con ${petName} eliminado`, {
                icon: '🗑️',
              });
              toast.dismiss(t.id);
            }}
            style={{
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Eliminar
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: '8px 16px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      style: {
        minWidth: '300px',
      }
    });
  };

  const handleSendMessage = (pet) => {
    // Crear conversación y cambiar a tab de chat
    createConversation(pet);
    onOpenChat && onOpenChat();
    toast.success(`Chat con ${pet.name} abierto`, {
      icon: '💬',
      duration: 2000,
    });
  };

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
          {matches.map((pet) => (
            <div key={pet.id} className="match-card">
              <div className="match-card-image">
                <img src={pet.image} alt={pet.name} />
                <div className="match-badge">✨ Match</div>
              </div>
              
              <div className="match-card-content">
                <h3 className="match-pet-name">{pet.name}</h3>
                
                <div className="match-pet-info">
                  <span className="info-item">
                    <strong>Edad:</strong> {pet.age}
                  </span>
                  <span className="info-item">
                    <strong>Raza:</strong> {pet.breed}
                  </span>
                  <span className="info-item">
                    <strong>Ubicación:</strong> {pet.location}
                  </span>
                </div>

                <div className="match-personality">
                  <p>{pet.personality}</p>
                </div>

                <div className="match-actions">
                  <button 
                    className="match-btn message-btn"
                    onClick={() => handleSendMessage(pet)}
                    title="Enviar mensaje"
                  >
                    <MessageCircle size={20} />
                    Enviar Mensaje
                  </button>
                  
                  <button 
                    className="match-btn delete-btn"
                    onClick={() => handleRemoveMatch(pet.id, pet.name)}
                    title="Eliminar match"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Matches;
