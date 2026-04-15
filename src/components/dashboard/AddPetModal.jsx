import { useState, useEffect, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import MapPicker from '../common/MapPicker';
import './AddPetModal.css';

const AddPetModal = ({ isOpen, onClose, onSave, editMode = false, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    photo: null,
    photoPreview: null,
    type: '',
    breed: '',
    age: '',
    characteristics: [],
    location: null
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
        characteristics: [],
        location: null
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

  const [showCropModal, setShowCropModal] = useState(false);
  const [cropPreview, setCropPreview] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [tempPosition, setTempPosition] = useState({ x: 50, y: 50 });
  const [frameDragging, setFrameDragging] = useState(false);
  const stageRef = useRef(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPendingFile(file);
      setTempPosition({ x: 50, y: 50 });
      const reader = new FileReader();
      reader.onloadend = () => { setCropPreview(reader.result); setShowCropModal(true); };
      reader.readAsDataURL(file);
    }
  };

  const onFrameMouseDown = (e) => { e.preventDefault(); e.stopPropagation(); setFrameDragging(true); };

  const onStageMouseMove = (e) => {
    if (!frameDragging || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const frameW = 240, frameH = 200;
    const cx = Math.max(frameW / 2, Math.min(rect.width - frameW / 2, e.clientX - rect.left));
    const cy = Math.max(frameH / 2, Math.min(rect.height - frameH / 2, e.clientY - rect.top));
    setTempPosition({ x: (cx / rect.width) * 100, y: (cy / rect.height) * 100 });
  };

  const onStageMouseUp = () => setFrameDragging(false);

  const handleConfirmCrop = async () => {
    const img = new Image();
    img.src = cropPreview;
    await new Promise((resolve) => { img.onload = resolve; });
    const stageW = 270, stageH = 225, frameW = 240, frameH = 200;
    const cx = (tempPosition.x / 100) * stageW;
    const cy = (tempPosition.y / 100) * stageH;
    const scale = Math.max(stageW / img.naturalWidth, stageH / img.naturalHeight);
    const ox = (img.naturalWidth * scale - stageW) / 2;
    const oy = (img.naturalHeight * scale - stageH) / 2;
    const srcX = (cx - frameW / 2 + ox) / scale;
    const srcY = (cy - frameH / 2 + oy) / scale;
    const canvas = document.createElement('canvas');
    canvas.width = 600; canvas.height = 500;
    canvas.getContext('2d').drawImage(img, srcX, srcY, frameW / scale, frameH / scale, 0, 0, 600, 500);
    const croppedUrl = canvas.toDataURL('image/jpeg', 0.9);
    const blob = await fetch(croppedUrl).then((r) => r.blob());
    setFormData({ ...formData, photo: new File([blob], pendingFile?.name || 'pet.jpg', { type: 'image/jpeg' }), photoPreview: croppedUrl });
    setShowCropModal(false);
  };

  const handleCancelCrop = () => setShowCropModal(false);

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
      characteristics: [],
      location: null
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
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

          {/* Map Picker - Location */}
          <div className="form-group">
            <MapPicker
              initialPosition={formData.location}
              onLocationChange={(position) => {
                setFormData({ ...formData, location: position });
              }}
              height="300px"
            />
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

    {showCropModal && (
      <div className="pet-crop-overlay" onClick={handleCancelCrop}>
        <div className="pet-crop-modal" onClick={(e) => e.stopPropagation()}>
          <h3 className="pet-crop-title">Recortar foto</h3>
          <p className="pet-crop-hint">Arrastra el marco para elegir qué parte mostrar</p>
          <div
            ref={stageRef}
            className="pet-crop-stage"
            onMouseMove={onStageMouseMove}
            onMouseUp={onStageMouseUp}
            onMouseLeave={onStageMouseUp}
          >
            <img src={cropPreview} alt="Preview" draggable={false} />
            <div
              className="pet-crop-frame"
              style={{ left: `${tempPosition.x}%`, top: `${tempPosition.y}%`, cursor: frameDragging ? 'grabbing' : 'grab' }}
              onMouseDown={onFrameMouseDown}
            />
          </div>
          <div className="pet-crop-actions">
            <button type="button" className="pet-crop-cancel" onClick={handleCancelCrop}>Cancelar</button>
            <button type="button" className="pet-crop-confirm" onClick={handleConfirmCrop}>Aplicar</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default AddPetModal;
