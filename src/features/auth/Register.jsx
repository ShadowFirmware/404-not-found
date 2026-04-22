import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import dashImage from '../../assets/images/dash.png';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contraseña: '',
    telefono: '',
    biografia: '',
    fecha_nacimiento: '',
    genero: '',
    ciudad: '',
    estado: '',
    pais: '',
  });
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.nombre.trim() || formData.nombre.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres.');
      return false;
    }
    if (!/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'\-]+$/.test(formData.nombre.trim())) {
      setError('El nombre solo puede contener letras, espacios y guiones.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Ingresa un correo electrónico válido.');
      return false;
    }
    if (formData.contraseña.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return false;
    }
    if (formData.telefono && !/^[\+]?[\d\s\-(). ]{7,20}$/.test(formData.telefono)) {
      setError('El teléfono no tiene un formato válido.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 1) {
      setError('');
      if (validateStep1()) setStep(2);
      return;
    }

    // Paso 2: llamar al API
    setLoading(true);
    setError('');
    try {
      const payload = {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.contraseña,
        ubicación: '0,0', // se actualiza en LocationPermission
        telefono: formData.telefono || undefined,
        biografia: formData.biografia || undefined,
        fecha_nacimiento: formData.fecha_nacimiento || undefined,
        genero: formData.genero || undefined,
        ciudad: formData.ciudad || undefined,
        estado: formData.estado || undefined,
        pais: formData.pais || undefined,
      };
      await register(payload);
      navigate('/location-permission');
    } catch (err) {
      const data = err?.response?.data;
      const extractMsg = (val) => {
        if (!val) return null;
        if (typeof val === 'string') return val;
        if (Array.isArray(val)) return val[0];
        if (typeof val === 'object') {
          const first = Object.values(val)[0];
          return extractMsg(first);
        }
        return String(val);
      };
      const detail = data?.detail;
      const msg = detail && typeof detail === 'object' && Object.keys(detail).length > 0
        ? extractMsg(Object.values(detail)[0])
        : extractMsg(data?.error) || extractMsg(data);
      setError(msg || 'Error al registrarse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundColor: 'black',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url(${dashImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="auth-box">
        <span className="auth-logo">PAWMATCH</span>
        <h1 className="auth-title">CREAR CUENTA</h1>

        {/* Indicador de pasos */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', width: '100%' }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ flex: 1, height: '4px', borderRadius: '2px', background: step >= s ? 'linear-gradient(90deg,#ff1e77 0%,#ff6b3d 100%)' : 'rgba(255,255,255,0.3)' }} />
          ))}
        </div>

        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
          Paso {step} de 2
        </p>

        {error && (
          <div style={{ width: '100%', padding: '12px 16px', marginBottom: '16px', borderRadius: '10px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {step === 1 && (
            <>
              <input type="text" name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} required style={inputStyle} />
              <input type="email" name="email" placeholder="Correo electrónico" value={formData.email} onChange={handleChange} required style={inputStyle} />
              <input type="password" name="contraseña" placeholder="Contraseña" value={formData.contraseña} onChange={handleChange} required minLength="8" style={inputStyle} />
              <input type="tel" name="telefono" placeholder="Teléfono (opcional)" value={formData.telefono} onChange={handleChange} style={inputStyle} />
            </>
          )}

          {step === 2 && (
            <>
              <textarea name="biografia" placeholder="Cuéntanos sobre ti (opcional)" value={formData.biografia} onChange={handleChange} rows="3" style={{ ...inputStyle, resize: 'none' }} />
              <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} style={{ ...inputStyle, colorScheme: 'dark' }} />
              <select name="genero" value={formData.genero} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="" style={{ background: '#1a1a1a' }}>Selecciona tu género</option>
                <option value="Masculino" style={{ background: '#1a1a1a' }}>Masculino</option>
                <option value="Femenino" style={{ background: '#1a1a1a' }}>Femenino</option>
                <option value="Otro" style={{ background: '#1a1a1a' }}>Otro</option>
                <option value="Prefiero no decir" style={{ background: '#1a1a1a' }}>Prefiero no decir</option>
              </select>
              <input type="text" name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} style={inputStyle} />
              <input type="text" name="estado" placeholder="Estado/Provincia" value={formData.estado} onChange={handleChange} style={inputStyle} />
              <input type="text" name="pais" placeholder="País" value={formData.pais} onChange={handleChange} style={inputStyle} />
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            {step === 2 && (
              <button type="button" onClick={() => setStep(1)} disabled={loading} style={{ flex: 1, padding: '18px', borderRadius: '30px', border: '2px solid rgba(255,255,255,0.4)', background: 'transparent', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
                Atrás
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 1, padding: '18px', borderRadius: '30px', border: 'none', backgroundImage: loading ? 'none' : 'linear-gradient(90deg,#ff1e77 0%,#ff6b3d 100%)', backgroundColor: loading ? '#666' : undefined, color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 10px 20px rgba(255,30,119,0.3)' }}
            >
              {loading ? 'Registrando...' : step === 1 ? 'Continuar' : 'Registrarse'}
            </button>
          </div>
        </form>

        <p onClick={() => navigate('/login')} style={{ color: 'white', marginTop: '30px', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
          ¿Ya tienes cuenta? <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Inicia sesión</span>
        </p>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '16px 20px', borderRadius: '12px',
  border: '2px solid rgba(255,255,255,0.4)', backgroundColor: 'transparent',
  color: 'white', fontSize: '16px', outline: 'none', boxSizing: 'border-box',
};

export default Register;
