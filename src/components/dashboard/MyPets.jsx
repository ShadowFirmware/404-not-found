import { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import PetProfileCard from './PetProfileCard';
import AddPetModal from './AddPetModal';
import './MyPets.css';

const MyPets = () => {
  const [pets, setPets] = useState([
    {
      id: 1,
      name: 'Max',
      photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
      type: 'Perro',
      breed: 'Golden Retriever',
      age: 3,
      characteristics: ['Juguetón', 'Sociable', 'Energético']
    }
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const maxPets = 5;

  const handleAddPet = (newPet) => {
    if (pets.length < maxPets) {
      const petWithId = {
        ...newPet,
        id: Date.now(),
        photo: newPet.photoPreview || 'https://via.placeholder.com/400x300?text=Pet+Photo'
      };
      setPets([...pets, petWithId]);
      toast.success(`¡${newPet.name} ha sido agregado exitosamente!`, {
        icon: '🎉',
        duration: 3000,
      });
      console.log('Pet added:', petWithId);
    }
  };

  const handleEditPet = (pet) => {
    toast((t) => (
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 12px 0', fontWeight: '600' }}>
          ¿Editar información de {pet.name}?
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => {
              setSelectedPet(pet);
              setIsEditModalOpen(true);
              toast.dismiss(t.id);
            }}
            style={{
              padding: '8px 16px',
              background: '#FF6B6B',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Sí, editar
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

  const handleUpdatePet = (updatedPet) => {
    setPets(pets.map(pet => 
      pet.id === updatedPet.id ? { ...updatedPet, photo: updatedPet.photoPreview || updatedPet.photo } : pet
    ));
    toast.success(`¡Información de ${updatedPet.name} actualizada!`, {
      icon: '✅',
      duration: 3000,
    });
    console.log('Pet updated:', updatedPet);
  };

  const handleDeletePet = (petId) => {
    const petToDelete = pets.find(pet => pet.id === petId);
    toast((t) => (
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 12px 0', fontWeight: '600' }}>
          ¿Eliminar a {petToDelete?.name}?
        </p>
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>
          Esta acción no se puede deshacer
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => {
              setPets(pets.filter(pet => pet.id !== petId));
              toast.success(`${petToDelete?.name} ha sido eliminado`, {
                icon: '🗑️',
              });
              toast.dismiss(t.id);
              console.log('Pet deleted:', petId);
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

  return (
    <div className="my-pets-container">
      <div className="my-pets-header">
        <div>
          <h1>Mis Mascotas</h1>
          <p className="pets-count">{pets.length} de {maxPets} mascotas registradas</p>
        </div>
        {pets.length < maxPets && (
          <button className="add-pet-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Agregar Nueva Mascota
          </button>
        )}
      </div>

      {pets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <h3>Aún no tienes mascotas registradas</h3>
            <p>¡Agrega tu primera mascota para comenzar a conectar con otros dueños!</p>
            <button className="add-pet-btn-large" onClick={() => setIsModalOpen(true)}>
              <Plus size={24} />
              Agregar Tu Primera Mascota
            </button>
          </div>
        </div>
      ) : (
        <div className="pets-grid">
          {pets.map((pet) => (
            <PetProfileCard 
              key={pet.id} 
              pet={pet}
              onEdit={handleEditPet}
              onDelete={handleDeletePet}
            />
          ))}
        </div>
      )}

      <AddPetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddPet}
      />

      <AddPetModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPet(null);
        }}
        onSave={handleUpdatePet}
        editMode={true}
        initialData={selectedPet}
      />
    </div>
  );
};

export default MyPets;
