import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { petService } from '../../services/petService';
import PetProfileCard from './PetProfileCard';
import AddPetModal from './AddPetModal';
import './MyPets.css';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';

const PLACEHOLDER = 'https://via.placeholder.com/400x300?text=Sin+foto';

/** Convierte mascota del backend al formato interno del componente */
const mapFromBackend = (m) => {
  const raw = m.foto_url || '';
  const photo = raw || PLACEHOLDER;
  return {
    id: m.mascota_id,
    name: m.nombre,
    photo,
    type: m.especie,
    breed: m.raza || '',
    age: m.edad,
    characteristics: m.descripción ? m.descripción.split(', ').filter(Boolean) : [],
  };
};

const MyPets = ({ onPetChanged }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const maxPets = 5;

  const loadPets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await petService.getMyPets();
      setPets(data.map(mapFromBackend));
    } catch {
      toast.error('Error al cargar tus mascotas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPets(); }, [loadPets]);

  const handleAddPet = async (formData) => {
    if (pets.length >= maxPets) return;
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('type', formData.type);
      fd.append('breed', formData.breed);
      fd.append('age', formData.age);
      formData.characteristics.forEach((c) => fd.append('characteristics', c));
      if (formData.photo) fd.append('photo', formData.photo);

      await petService.createPet(fd);
      await loadPets();
      onPetChanged && onPetChanged();
      toast.success(`¡${formData.name} ha sido agregado exitosamente!`, { icon: '🎉' });
    } catch (err) {
      const msg = err?.response?.data?.non_field_errors?.[0] || err?.response?.data?.detail || 'Error al guardar la mascota';
      toast.error(msg);
    }
  };

  const handleEditPet = (pet) => {
    toast((t) => (
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 12px 0', fontWeight: '600' }}>¿Editar información de {pet.name}?</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button onClick={() => { setSelectedPet(pet); setIsEditModalOpen(true); toast.dismiss(t.id); }}
            style={{ padding: '8px 16px', background: '#FF6B6B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            Sí, editar
          </button>
          <button onClick={() => toast.dismiss(t.id)}
            style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            Cancelar
          </button>
        </div>
      </div>
    ), { duration: 5000, style: { minWidth: '300px' } });
  };

  const handleUpdatePet = async (formData) => {
    if (!selectedPet) return;
    try {
      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('type', formData.type);
      fd.append('breed', formData.breed);
      fd.append('age', formData.age);
      formData.characteristics.forEach((c) => fd.append('characteristics', c));
      if (formData.photo) fd.append('photo', formData.photo);

      await petService.updatePet(selectedPet.id, fd);
      await loadPets();
      onPetChanged && onPetChanged();
      toast.success(`¡Información de ${formData.name} actualizada!`, { icon: '✅' });
    } catch {
      toast.error('Error al actualizar la mascota');
    }
  };

  const handleDeletePet = (petId) => {
    const pet = pets.find((p) => p.id === petId);
    toast((t) => (
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: '0 0 12px 0', fontWeight: '600' }}>¿Eliminar a {pet?.name}?</p>
        <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#666' }}>Esta acción no se puede deshacer</p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={async () => {
              try {
                await petService.deletePet(petId);
                await loadPets();
                onPetChanged && onPetChanged();
                toast.success(`${pet?.name} ha sido eliminado`, { icon: '🗑️' });
              } catch {
                toast.error('Error al eliminar la mascota');
              }
              toast.dismiss(t.id);
            }}
            style={{ padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            Eliminar
          </button>
          <button onClick={() => toast.dismiss(t.id)}
            style={{ padding: '8px 16px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
            Cancelar
          </button>
        </div>
      </div>
    ), { duration: 5000, style: { minWidth: '300px' } });
  };

  if (loading) {
    return (
      <div className="my-pets-container">
        <div className="empty-state">
          <div className="empty-state-content">
            <h3>Cargando mascotas...</h3>
          </div>
        </div>
      </div>
    );
  }

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
            <PetProfileCard key={pet.id} pet={pet} onEdit={handleEditPet} onDelete={handleDeletePet} />
          ))}
        </div>
      )}

      <AddPetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddPet} />

      <AddPetModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedPet(null); }}
        onSave={handleUpdatePet}
        editMode={true}
        initialData={selectedPet}
      />
    </div>
  );
};

export default MyPets;
