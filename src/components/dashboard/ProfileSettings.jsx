import { useState, useEffect, useRef } from 'react';
import { Camera, Save, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
    biografia: '',
    mostrar_telefono: false,
    mostrar_email: false,
  });
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [tempPosition, setTempPosition] = useState({ x: 50, y: 50 });
  const [frameDragging, setFrameDragging] = useState(false);
  const stageRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [original, setOriginal] = useState(null);

  // Validaciones simples
  const validationRules = {
    nombre: { pattern: /^.{2,100}$/, message: 'El nombre debe tener entre 2 y 100 caracteres' },
    email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Ingresa un email válido' },
    telefono: { pattern: /^$|^[\+]?[\d\s\-().]{7,20}$/, message: 'Teléfono inválido' },
    ciudad: { pattern: /^.{0,100}$/, message: 'Ciudad demasiado larga' },
    biografia: { pattern: /^[\s\S]{0,500}$/, message: 'La biografía no puede superar 500 caracteres' },
  };

  useEffect(() => {
    const load = async () => {
      try {
        const data = await authService.getProfile();
        const initial = {
          nombre: data.nombre || '',
          email: data.email || '',
          telefono: data.telefono || '',
          ciudad: data.ciudad || '',
          biografia: data.biografia || '',
          mostrar_telefono: data.mostrar_telefono || false,
          mostrar_email: data.mostrar_email || false,
        };
        setFormData(initial);
        setOriginal(initial);
        setPhotoPreview(data.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.nombre || 'U')}&background=FF6B6B&color=fff&size=200`);
      } catch {
        toast.error('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const validateField = (name, value) => {
    const rule = validationRules[name];
    if (!rule) return '';
    return rule.pattern.test(value) ? '' : rule.message;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (type !== 'checkbox') {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, newValue) }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setTempPosition({ x: 50, y: 50 });
    const reader = new FileReader();
    reader.onloadend = () => { setPhotoPreview(reader.result); setShowPositionModal(true); };
    reader.readAsDataURL(file);
  };

  const onFrameMouseDown = (e) => { e.preventDefault(); e.stopPropagation(); setFrameDragging(true); };

  const onStageMouseMove = (e) => {
    if (!frameDragging || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const frameRadius = 80;
    const cx = Math.max(frameRadius, Math.min(rect.width - frameRadius, e.clientX - rect.left));
    const cy = Math.max(frameRadius, Math.min(rect.height - frameRadius, e.clientY - rect.top));
    setTempPosition({ x: (cx / rect.width) * 100, y: (cy / rect.height) * 100 });
  };

  const onStageMouseUp = () => setFrameDragging(false);

  const handleConfirmPosition = async () => {
    const img = new Image();
    img.src = photoPreview;
    await new Promise((resolve) => { img.onload = resolve; });

    const stageSize = 272;
    const frameSize = 160;
    const cx = (tempPosition.x / 100) * stageSize;
    const cy = (tempPosition.y / 100) * stageSize;
    const scale = Math.max(stageSize / img.naturalWidth, stageSize / img.naturalHeight);
    const ox = (img.naturalWidth * scale - stageSize) / 2;
    const oy = (img.naturalHeight * scale - stageSize) / 2;
    const srcX = (cx - frameSize / 2 + ox) / scale;
    const srcY = (cy - frameSize / 2 + oy) / scale;
    const srcSize = frameSize / scale;

    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    canvas.getContext('2d').drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, 200, 200);

    const croppedUrl = canvas.toDataURL('image/jpeg', 0.9);
    const blob = await fetch(croppedUrl).then((r) => r.blob());
    setPhotoPreview(croppedUrl);
    setPhotoFile(new File([blob], photoFile?.name || 'profile.jpg', { type: 'image/jpeg' }));
    setShowPositionModal(false);
  };

  const handleCancelPosition = () => { setShowPositionModal(false); };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach((field) => {
      const err = validateField(field, formData[field] || '');
      if (err) newErrors[field] = err;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }
    setSaving(true);
    try {
      const payload = { ...formData };
      if (photoFile) {
        payload.foto_perfil = photoPreview;
      }
      await authService.updateProfile(payload);
      setOriginal(formData);
      toast.success('¡Perfil actualizado correctamente!', { icon: '✅' });
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.detail || 'Error al guardar el perfil';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (original) {
      setFormData(original);
      setErrors({});
      setPhotoFile(null);
    }
  };

  if (loading) {
    return (
      <div className="profile-settings-container">
        <div className="profile-settings-header">
          <h1>Configuración de Perfil</h1>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-settings-container">
      <div className="profile-settings-header">
        <h1>Configuración de Perfil</h1>
        <p>Administra la información de tu cuenta</p>
      </div>

      <div className="profile-settings-card">
        <form onSubmit={handleSave}>
          {/* Foto de Perfil */}
          <div className="profile-section">
            <h2 className="section-title">Foto de Perfil</h2>
            <div className="profile-photo-section">
              <div className="profile-photo-wrapper">
                <img
                  src={photoPreview}
                  alt="Foto de perfil"
                  className="profile-photo"
                  draggable={false}
                />
                <button type="button" className="change-photo-btn" onClick={() => document.getElementById('photoInput').click()}>
                  <Camera size={20} />
                </button>
                <input id="photoInput" type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
              </div>
              <div className="profile-photo-info">
                <button type="button" className="btn-change-photo" onClick={() => document.getElementById('photoInput').click()}>
                  Cambiar foto
                </button>
                <p className="photo-hint">JPG, PNG o GIF. Máximo 5MB.</p>
              </div>
            </div>
          </div>

          {/* Información Personal */}
          <div className="profile-section">
            <h2 className="section-title">Información Personal</h2>
            <div className="form-grid">
              <div className="form-field full-width">
                <label htmlFor="nombre">Nombre completo</label>
                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Tu nombre completo" className={errors.nombre ? 'input-error' : ''} />
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="tu@email.com" className={errors.email ? 'input-error' : ''} />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="+52 55 1234 5678" className={errors.telefono ? 'input-error' : ''} />
                {errors.telefono && <span className="error-message">{errors.telefono}</span>}
              </div>

              <div className="form-field full-width">
                <label htmlFor="ciudad">Ciudad</label>
                <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} placeholder="Tu ciudad" className={errors.ciudad ? 'input-error' : ''} />
                {errors.ciudad && <span className="error-message">{errors.ciudad}</span>}
              </div>
            </div>
          </div>

          {/* Sobre Mí */}
          <div className="profile-section">
            <h2 className="section-title">Sobre Mí</h2>
            <div className="form-field">
              <label htmlFor="biografia">Cuéntanos sobre ti y tu mascota</label>
              <textarea id="biografia" name="biografia" value={formData.biografia} onChange={handleInputChange} placeholder="Escribe algo sobre ti y tus mascotas..." rows="5" className={errors.biografia ? 'input-error' : ''} />
              {errors.biografia && <span className="error-message">{errors.biografia}</span>}
            </div>
          </div>

          {/* Preferencias de privacidad */}
          <div className="profile-section">
            <h2 className="section-title">Preferencias</h2>
            <div className="preferences-list">
              <div className="preference-item">
                <div className="preference-info">
                  <label htmlFor="mostrar_telefono">Mostrar teléfono en mi perfil</label>
                  <p className="preference-description">Otros usuarios podrán ver tu número de teléfono</p>
                </div>
                <label className="switch">
                  <input type="checkbox" id="mostrar_telefono" name="mostrar_telefono" checked={formData.mostrar_telefono} onChange={handleInputChange} />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="preference-item">
                <div className="preference-info">
                  <label htmlFor="mostrar_email">Mostrar email en mi perfil</label>
                  <p className="preference-description">Otros usuarios podrán ver tu correo electrónico</p>
                </div>
                <label className="switch">
                  <input type="checkbox" id="mostrar_email" name="mostrar_email" checked={formData.mostrar_email} onChange={handleInputChange} />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="profile-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel} disabled={saving}>
              <X size={20} />
              Cancelar
            </button>
            <button type="submit" className="btn-save" disabled={saving}>
              <Save size={20} />
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

      {/* Cerrar sesión */}
      <div className="profile-settings-card logout-section">
        <h2 className="section-title">Sesión</h2>
        <p className="preference-description" style={{ marginBottom: '16px' }}>
          Al cerrar sesión deberás volver a iniciar con tu correo y contraseña.
        </p>
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={18} />
          Cerrar Sesión
        </button>
      </div>

      {showPositionModal && (
        <div className="position-modal-overlay" onClick={handleCancelPosition}>
          <div className="position-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="position-modal-title">Reposicionar foto</h3>
            <p className="position-modal-hint">Arrastra el marco para elegir qué parte mostrar</p>
            <div
              ref={stageRef}
              className="position-modal-stage"
              onMouseMove={onStageMouseMove}
              onMouseUp={onStageMouseUp}
              onMouseLeave={onStageMouseUp}
            >
              <img src={photoPreview} alt="Preview" draggable={false} />
              <div
                className="position-modal-frame"
                style={{ left: `${tempPosition.x}%`, top: `${tempPosition.y}%`, cursor: frameDragging ? 'grabbing' : 'grab' }}
                onMouseDown={onFrameMouseDown}
              />
            </div>
            <div className="position-modal-actions">
              <button type="button" className="btn-position-cancel" onClick={handleCancelPosition}>Cancelar</button>
              <button type="button" className="btn-position-confirm" onClick={handleConfirmPosition}>Aplicar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
