import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Check } from 'lucide-react';
import MapPicker from '../../components/common/MapPicker';
import '../../components/dashboard/AddPetModal.css';

const PetOnboarding = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    photo: null,
    photoPreview: null,
    name: '',
    petType: '',
    breed: '',
    age: '',
    characteristics: [],
    location: null
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropPreview, setCropPreview] = useState('');
  const [pendingFile, setPendingFile] = useState(null);
  const [tempPosition, setTempPosition] = useState({ x: 50, y: 50 });
  const [frameDragging, setFrameDragging] = useState(false);
  const stageRef = useRef(null);

  const petTypeOptions = [
    'Perro',
    'Gato',
    'Conejo',
    'Hurón',
    'Cotorro',
    'Hámster'
  ];

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
    setErrors({ ...errors, photo: '' });
    setShowCropModal(false);
  };

  const handleCancelCrop = () => setShowCropModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors({ ...errors, [name]: '' });
  };

  const toggleSelection = (field, value) => {
    const currentSelection = formData[field];
    const newSelection = currentSelection.includes(value)
      ? currentSelection.filter(item => item !== value)
      : [...currentSelection, value];
    
    setFormData({
      ...formData,
      [field]: newSelection
    });
    setErrors({ ...errors, [field]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.photo) {
      newErrors.photo = 'Por favor selecciona una foto de tu mascota';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    if (!formData.petType) {
      newErrors.petType = 'Selecciona el tipo de mascota';
    }
    if (!formData.breed.trim()) {
      newErrors.breed = 'La raza es obligatoria';
    }
    if (!formData.age || formData.age <= 0) {
      newErrors.age = 'Por favor ingresa una edad válida';
    }
    if (formData.characteristics.length === 0) {
      newErrors.characteristics = 'Selecciona al menos una característica';
    }
    if (!formData.location) {
      newErrors.location = 'Por favor selecciona la ubicación de tu mascota en el mapa';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        // Limpiar formulario
        setFormData({
          photo: null,
          photoPreview: null,
          name: '',
          petType: '',
          breed: '',
          age: '',
          characteristics: [],
          location: null
        });
      }, 3000);
    }
  };

  return (
    <>
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingTop: '60px',
      paddingBottom: '60px',
      paddingLeft: '20px',
      paddingRight: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      boxSizing: 'border-box',
      overflowY: 'auto'
    }}>
      {/* Logo PAWMATCH - Fixed top left */}
      <div style={{
        position: 'fixed',
        top: '50px',
        left: '60px',
        zIndex: 1000
      }}>
        <div style={{ 
          color: '#ffffff', 
          fontSize: '32px', 
          fontWeight: '900', 
          letterSpacing: '-0.02em' 
        }}>
          PAWMATCH
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <Check size={24} />
          <span style={{ fontWeight: '600' }}>Mascota registrada correctamente (simulación frontend)</span>
        </div>
      )}

      {/* Main Card */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        backgroundColor: 'rgba(26, 32, 44, 0.95)',
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: '8px',
            letterSpacing: '-0.5px'
          }}>
            ¡Bienvenido!
          </h1>
          <p style={{
            fontSize: '16px',
            color: '#94a3b8',
            fontWeight: '400'
          }}>
            Para comenzar registra tu primera mascota 🐾
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Photo Upload */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#e2e8f0',
              marginBottom: '12px'
            }}>
              Foto de la mascota
            </label>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '160px',
              borderRadius: '12px',
              border: `2px dashed ${errors.photo ? '#ef4444' : 'rgba(148, 163, 184, 0.3)'}`,
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#6366f1'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = errors.photo ? '#ef4444' : 'rgba(148, 163, 184, 0.3)'}
            onClick={() => document.getElementById('photoInput').click()}>
              {formData.photoPreview ? (
                <img 
                  src={formData.photoPreview} 
                  alt="Preview" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <Upload size={40} style={{ margin: '0 auto 12px' }} />
                  <p style={{ fontSize: '14px', fontWeight: '500' }}>Haz clic para subir una foto</p>
                  <p style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>PNG, JPG hasta 10MB</p>
                </div>
              )}
              <input
                id="photoInput"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ display: 'none' }}
              />
            </div>
            {errors.photo && (
              <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>
                {errors.photo}
              </p>
            )}
          </div>

          {/* Name */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#e2e8f0',
              marginBottom: '12px'
            }}>
              Nombre de la mascota
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ej: Max"
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                border: `1px solid ${errors.name ? '#ef4444' : 'rgba(148, 163, 184, 0.2)'}`,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                color: '#ffffff',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = errors.name ? '#ef4444' : 'rgba(148, 163, 184, 0.2)'}
            />
            {errors.name && (
              <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Pet Type */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#e2e8f0',
              marginBottom: '12px'
            }}>
              Tipo de mascota
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {petTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, petType: type });
                    setErrors({ ...errors, petType: '' });
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: formData.petType === type
                      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                      : 'rgba(15, 23, 42, 0.6)',
                    color: formData.petType === type ? '#ffffff' : '#94a3b8',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${formData.petType === type ? 'transparent' : 'rgba(148, 163, 184, 0.2)'}`,
                    boxShadow: formData.petType === type ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (formData.petType !== type) {
                      e.target.style.borderColor = '#6366f1';
                      e.target.style.color = '#e2e8f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (formData.petType !== type) {
                      e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                      e.target.style.color = '#94a3b8';
                    }
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
            {errors.petType && (
              <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>
                {errors.petType}
              </p>
            )}
          </div>

          {/* Breed and Age - Two columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Breed */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '12px'
              }}>
                Raza
              </label>
              <input
                type="text"
                name="breed"
                value={formData.breed}
                onChange={handleInputChange}
                placeholder="Ej: Labrador"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${errors.breed ? '#ef4444' : 'rgba(148, 163, 184, 0.2)'}`,
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  color: '#ffffff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = errors.breed ? '#ef4444' : 'rgba(148, 163, 184, 0.2)'}
              />
              {errors.breed && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>
                  {errors.breed}
                </p>
              )}
            </div>

            {/* Age */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#e2e8f0',
                marginBottom: '12px'
              }}>
                Edad (años)
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Ej: 3"
                min="0"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: `1px solid ${errors.age ? '#ef4444' : 'rgba(148, 163, 184, 0.2)'}`,
                  backgroundColor: 'rgba(15, 23, 42, 0.6)',
                  color: '#ffffff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = errors.age ? '#ef4444' : 'rgba(148, 163, 184, 0.2)'}
              />
              {errors.age && (
                <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>
                  {errors.age}
                </p>
              )}
            </div>
          </div>

          {/* Map Picker - Location */}
          <div>
            <MapPicker
              initialPosition={formData.location}
              onLocationChange={(position) => {
                setFormData({ ...formData, location: position });
                setErrors({ ...errors, location: '' });
              }}
              height="350px"
            />
            {errors.location && (
              <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px', fontWeight: '500' }}>
                {errors.location}
              </p>
            )}
          </div>

          {/* Characteristics */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#e2e8f0',
              marginBottom: '12px'
            }}>
              Características de la mascota
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {characteristicsOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleSelection('characteristics', option)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: formData.characteristics.includes(option)
                      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                      : 'rgba(15, 23, 42, 0.6)',
                    color: formData.characteristics.includes(option) ? '#ffffff' : '#94a3b8',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: `1px solid ${formData.characteristics.includes(option) ? 'transparent' : 'rgba(148, 163, 184, 0.2)'}`,
                    boxShadow: formData.characteristics.includes(option) ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!formData.characteristics.includes(option)) {
                      e.target.style.borderColor = '#6366f1';
                      e.target.style.color = '#e2e8f0';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!formData.characteristics.includes(option)) {
                      e.target.style.borderColor = 'rgba(148, 163, 184, 0.2)';
                      e.target.style.color = '#94a3b8';
                    }
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            {errors.characteristics && (
              <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '6px', fontWeight: '500' }}>
                {errors.characteristics}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              marginTop: '8px',
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 32px rgba(99, 102, 241, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 24px rgba(99, 102, 241, 0.4)';
            }}
          >
            Registrar mascota
          </button>
        </form>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
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

export default PetOnboarding;
