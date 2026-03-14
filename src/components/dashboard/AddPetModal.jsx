import { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import './AddPetModal.css';

const AddPetModal = ({ isOpen, onClose, onSave, editMode = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    photo: null,
    photoPreview: null,
    type: '',
    breed: '',
    age: '',
    characteristics: []
  });

  // Cargar datos iniciales cuando se abre en modo edición
  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        ...initialData,
        photoPreview: initialData.photo,
        age: initialData.age.toString()
      });
    } else if (!editMode) {
      setFormData({
        name: '',
        photo: null,
        photoPreview: null,
        type: '',
        breed: '',
        age: '',
        characteristics: []
      });
    }
  }, [editMode, initialData, isOpen]);

  const petTypes = ['Perro', 'Gato', 'Conejo', 'Hurón', 'Cotorro', 'Hámster'];
  
  const characteristicsOptions = [
    'Juguetón',
    'Dormilón',
    'Serio',
    'Sociable',
    'Tranquilo',
    'Energético',
    'Protector',
    'Cariñoso'
  ];

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const toggleCharacteristic = (characteristic) => {
    setFormData({
      ...formData,
      characteristics: formData.characteristics.includes(characteristic)
        ? formData.characteristics.filter(c => c !== characteristic)
        : [...formData.characteristics, characteristic]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      photo: null,
      photoPreview: null,
      type: '',
      breed: '',
      age: '',
      characteristics: []
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editMode ? 'Editar Mascota' : 'Registrar Nueva Mascota'}</h2>
          <button className="modal-close-btn" onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Pet Name */}
          <div className="form-group">
            <label htmlFor="name">Nombre de la Mascota</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ingresa el nombre de tu mascota"
              required
            />
          </div>

          {/* Upload Photo */}
          <div className="form-group">
            <label>Subir Foto de la Mascota</label>
            <div className="photo-upload-area" onClick={() => document.getElementById('photoInput').click()}>
              {formData.photoPreview ? (
                <img src={formData.photoPreview} alt="Preview" className="photo-preview" />
              ) : (
                <div className="photo-placeholder">
                  <Upload size={32} />
                  <p>Haz clic para subir una foto</p>
                </div>
              )}
              <input
                id="photoInput"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
                required
              />
            </div>
          </div>

          {/* Pet Type */}
          <div className="form-group">
            <label htmlFor="type">Tipo de Mascota</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona el tipo de mascota</option>
              {petTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Breed and Age - Two columns */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="breed">Raza</label>
              <input
                type="text"
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                placeholder="Ingresa la raza"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="age">Edad (años)</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Ingresa la edad"
                min="0"
                required
              />
            </div>
          </div>

          {/* Personality Traits */}
          <div className="form-group">
            <label>Rasgos de Personalidad</label>
            <div className="traits-selector">
              {characteristicsOptions.map((trait) => (
                <button
                  key={trait}
                  type="button"
                  className={`trait-chip ${formData.characteristics.includes(trait) ? 'selected' : ''}`}
                  onClick={() => toggleCharacteristic(trait)}
                >
                  {trait}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              {editMode ? 'Actualizar Mascota' : 'Guardar Mascota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPetModal;
