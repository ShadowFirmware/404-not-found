import { useState, useEffect } from 'react';
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
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
  };

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
      await authService.updateProfile(payload, photoFile || null);
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
                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Tu nombre completo" maxLength={100} className={errors.nombre ? 'input-error' : ''} />
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="tu@email.com" maxLength={254} className={errors.email ? 'input-error' : ''} />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="telefono">Teléfono</label>
                <input type="tel" id="telefono" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="777 123 4567" maxLength={15} className={errors.telefono ? 'input-error' : ''} />
                {errors.telefono && <span className="error-message">{errors.telefono}</span>}
              </div>

              <div className="form-field full-width">
                <label htmlFor="ciudad">Ciudad</label>
                <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} placeholder="Tu ciudad" maxLength={100} className={errors.ciudad ? 'input-error' : ''} />
                {errors.ciudad && <span className="error-message">{errors.ciudad}</span>}
              </div>
            </div>
          </div>

          {/* Sobre Mí */}
          <div className="profile-section">
            <h2 className="section-title">Sobre Mí</h2>
            <div className="form-field">
              <label htmlFor="biografia">Cuéntanos sobre ti y tu mascota</label>
              <textarea id="biografia" name="biografia" value={formData.biografia} onChange={handleInputChange} placeholder="Escribe algo sobre ti y tus mascotas..." rows="5" maxLength={500} className={errors.biografia ? 'input-error' : ''} />
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

    </div>
  );
};

export default ProfileSettings;
