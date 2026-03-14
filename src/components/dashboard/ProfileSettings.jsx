import { useState } from 'react';
import { Camera, Save, X } from 'lucide-react';
import './ProfileSettings.css';

const ProfileSettings = () => {
  const [formData, setFormData] = useState({
    firstName: 'Bryan',
    lastName: 'Villamil',
    email: 'bryan@pawmatch.com',
    city: 'San Francisco',
    phone: '+1 (555) 123-4567',
    bio: 'Me encanta pasar tiempo con mi perro Max. Siempre estamos buscando nuevos amigos peludos para jugar en el parque.',
    profilePhoto: 'https://ui-avatars.com/api/?name=Bryan+Villamil&background=FF6B6B&color=fff&size=200',
    showPublicly: true,
    allowMessages: true,
    emailNotifications: false
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(formData.profilePhoto);

  // Expresiones regulares para validación
  const validationRules = {
    firstName: {
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
      message: 'El nombre debe contener solo letras (2-50 caracteres)'
    },
    lastName: {
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
      message: 'El apellido debe contener solo letras (2-50 caracteres)'
    },
    email: {
      pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
      message: 'Ingresa un email válido (ejemplo@dominio.com)'
    },
    phone: {
      pattern: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/,
      message: 'Ingresa un teléfono válido (ej: +1 555 123-4567)'
    },
    city: {
      pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,100}$/,
      message: 'La ciudad debe contener solo letras (2-100 caracteres)'
    },
    bio: {
      pattern: /^.{10,500}$/,
      message: 'La biografía debe tener entre 10 y 500 caracteres'
    }
  };

  // Validar un campo individual
  const validateField = (name, value) => {
    if (!validationRules[name]) return '';
    
    const rule = validationRules[name];
    if (!rule.pattern.test(value)) {
      return rule.message;
    }
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData({
      ...formData,
      [name]: newValue
    });

    // Validar en tiempo real solo para campos de texto
    if (type !== 'checkbox' && validationRules[name]) {
      const error = validateField(name, newValue);
      setErrors({
        ...errors,
        [name]: error
      });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validar todo el formulario antes de guardar
  const validateForm = () => {
    const newErrors = {};
    
    // Validar cada campo
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Guardando cambios:', formData);
      alert('Cambios guardados exitosamente');
      // Aquí iría la llamada al backend
    } else {
      alert('Por favor corrige los errores en el formulario');
    }
  };

  const handleCancel = () => {
    console.log('Cancelando cambios');
    // Aquí podrías resetear el formulario a los valores originales
  };

  return (
    <div className="profile-settings-container">
      <div className="profile-settings-header">
        <h1>Configuración de Perfil</h1>
        <p>Administra la información de tu cuenta</p>
      </div>

      <div className="profile-settings-card">
        <form onSubmit={handleSave}>
          {/* SECCIÓN 1: FOTO DE PERFIL */}
          <div className="profile-section">
            <h2 className="section-title">Foto de Perfil</h2>
            <div className="profile-photo-section">
              <div className="profile-photo-wrapper">
                <img src={photoPreview} alt="Foto de perfil" className="profile-photo" />
                <button
                  type="button"
                  className="change-photo-btn"
                  onClick={() => document.getElementById('photoInput').click()}
                >
                  <Camera size={20} />
                </button>
                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
              </div>
              <div className="profile-photo-info">
                <button
                  type="button"
                  className="btn-change-photo"
                  onClick={() => document.getElementById('photoInput').click()}
                >
                  Cambiar foto
                </button>
                <p className="photo-hint">JPG, PNG o GIF. Máximo 5MB.</p>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: INFORMACIÓN PERSONAL */}
          <div className="profile-section">
            <h2 className="section-title">Información Personal</h2>
            <div className="form-grid">
              <div className="form-field">
                <label htmlFor="firstName">Nombre</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  className={errors.firstName ? 'input-error' : ''}
                  required
                />
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="lastName">Apellido</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Tu apellido"
                  className={errors.lastName ? 'input-error' : ''}
                  required
                />
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className={errors.email ? 'input-error' : ''}
                  required
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-field">
                <label htmlFor="phone">Teléfono</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className={errors.phone ? 'input-error' : ''}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <div className="form-field full-width">
                <label htmlFor="city">Ciudad</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Tu ciudad"
                  className={errors.city ? 'input-error' : ''}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: SOBRE MÍ */}
          <div className="profile-section">
            <h2 className="section-title">Sobre Mí</h2>
            <div className="form-field">
              <label htmlFor="bio">Cuéntanos sobre ti y tu mascota</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Escribe algo sobre ti y tus mascotas..."
                rows="5"
                className={errors.bio ? 'input-error' : ''}
              />
              {errors.bio && <span className="error-message">{errors.bio}</span>}
            </div>
          </div>

          {/* SECCIÓN 4: PREFERENCIAS */}
          <div className="profile-section">
            <h2 className="section-title">Preferencias</h2>
            <div className="preferences-list">
              <div className="preference-item">
                <div className="preference-info">
                  <label htmlFor="showPublicly">Mostrar mi perfil públicamente</label>
                  <p className="preference-description">
                    Otros usuarios podrán ver tu perfil y tus mascotas
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    id="showPublicly"
                    name="showPublicly"
                    checked={formData.showPublicly}
                    onChange={handleInputChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <label htmlFor="allowMessages">Permitir mensajes de otros usuarios</label>
                  <p className="preference-description">
                    Recibirás mensajes de otros dueños de mascotas
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    id="allowMessages"
                    name="allowMessages"
                    checked={formData.allowMessages}
                    onChange={handleInputChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="preference-item">
                <div className="preference-info">
                  <label htmlFor="emailNotifications">Recibir notificaciones por email</label>
                  <p className="preference-description">
                    Te enviaremos actualizaciones sobre matches y mensajes
                  </p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleInputChange}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* SECCIÓN 5: BOTONES */}
          <div className="profile-actions">
            <button type="button" className="btn-cancel" onClick={handleCancel}>
              <X size={20} />
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              <Save size={20} />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
