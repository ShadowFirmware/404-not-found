import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dashImage from '../../assets/images/dash.png';
import Toast from '../../components/common/Toast';

const Register = () => {
  const navigate = useNavigate();
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
    pais: ''
  });
  const [step, setStep] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar campos según el paso
    if (step === 1) {
      if (formData.nombre && formData.email && formData.contraseña) {
        setStep(2);
      }
    } else if (step === 2) {
      // Validar campos opcionales y continuar
      setShowToast(true);
      setTimeout(() => {
        navigate('/location-permission');
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999, // Tapa la barra blanca y los iconos de arriba definitivamente
        backgroundColor: 'black',
        // El degradado va PRIMERO para que oscurezca la imagen y las letras se vean blancas
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${dashImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {showToast && (
        <Toast 
          message="Registro exitoso" 
          type="success" 
          onClose={() => setShowToast(false)} 
        />
      )}

      {/* Logo PAWMATCH - Arriba a la izquierda */}
      <div style={{ position: 'absolute', top: '40px', left: '60px' }}>
        <span style={{ color: 'white', fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>
          PAWMATCH
        </span>
      </div>

      {/* MODAL CENTRAL ESTRECHO */}
      <div style={{
        width: '100%',
        maxWidth: '340px', // Este ancho hace que se vea proporcional como pediste
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 100000 // Asegura que el modal esté por encima del fondo
      }}>
        
        <h1 style={{
          color: 'white',
          fontSize: '48px',
          fontWeight: '900',
          marginBottom: '20px',
          textAlign: 'center',
          letterSpacing: '-1px',
          textShadow: '0 4px 10px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap'
        }}>
          CREAR CUENTA
        </h1>
        
        {/* Indicador de pasos */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
          <div style={{
            width: '50%',
            height: '4px',
            borderRadius: '2px',
            background: step >= 1 ? 'linear-gradient(90deg, #ff1e77 0%, #ff6b3d 100%)' : 'rgba(255,255,255,0.3)'
          }} />
          <div style={{
            width: '50%',
            height: '4px',
            borderRadius: '2px',
            background: step >= 2 ? 'linear-gradient(90deg, #ff1e77 0%, #ff6b3d 100%)' : 'rgba(255,255,255,0.3)'
          }} />
        </div>
        
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
          Paso {step} de 2
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px', maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
          
          {step === 1 && (
            <>
              <input 
                type="text"
                name="nombre"
                placeholder="Nombre completo"
                value={formData.nombre}
                onChange={handleChange}
                required
                style={inputStyle} 
              />
              <input 
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                required
                style={inputStyle} 
              />
              <input 
                type="password"
                name="contraseña"
                placeholder="Contraseña"
                value={formData.contraseña}
                onChange={handleChange}
                required
                minLength="8"
                style={inputStyle} 
              />
              <input 
                type="tel"
                name="telefono"
                placeholder="Teléfono (opcional)"
                value={formData.telefono}
                onChange={handleChange}
                style={inputStyle} 
              />
            </>
          )}

          {step === 2 && (
            <>
              <textarea 
                name="biografia"
                placeholder="Cuéntanos sobre ti (opcional)"
                value={formData.biografia}
                onChange={handleChange}
                rows="3"
                style={{...inputStyle, resize: 'none'}} 
              />
              <input 
                type="date"
                name="fecha_nacimiento"
                placeholder="Fecha de nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                style={{...inputStyle, colorScheme: 'dark'}} 
              />
              <select 
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                style={{...inputStyle, cursor: 'pointer'}}
              >
                <option value="" style={{background: '#1a1a1a'}}>Selecciona tu género</option>
                <option value="masculino" style={{background: '#1a1a1a'}}>Masculino</option>
                <option value="femenino" style={{background: '#1a1a1a'}}>Femenino</option>
                <option value="otro" style={{background: '#1a1a1a'}}>Otro</option>
                <option value="prefiero_no_decir" style={{background: '#1a1a1a'}}>Prefiero no decir</option>
              </select>
              <input 
                type="text"
                name="ciudad"
                placeholder="Ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                style={inputStyle} 
              />
              <input 
                type="text"
                name="estado"
                placeholder="Estado/Provincia"
                value={formData.estado}
                onChange={handleChange}
                style={inputStyle} 
              />
              <input 
                type="text"
                name="pais"
                placeholder="País"
                value={formData.pais}
                onChange={handleChange}
                style={inputStyle} 
              />
            </>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
            {step === 2 && (
              <button 
                type="button"
                onClick={handleBack}
                style={{
                  flex: 1,
                  padding: '18px',
                  borderRadius: '30px',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  background: 'transparent',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  cursor: 'pointer'
                }}
              >
                Atrás
              </button>
            )}
            <button 
              type="submit"
              style={{
                flex: 1,
                padding: '18px',
                borderRadius: '30px',
                border: 'none',
                backgroundImage: 'linear-gradient(90deg, #ff1e77 0%, #ff6b3d 100%)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                cursor: 'pointer',
                boxShadow: '0 10px 20px rgba(255, 30, 119, 0.3)'
              }}
            >
              {step === 1 ? 'Continuar' : 'Registrarse'}
            </button>
          </div>
        </form>

        {/* Link para Iniciar sesión */}
        <p 
          onClick={() => navigate('/login')}
          style={{ 
            color: 'white', 
            marginTop: '30px', 
            fontSize: '14px', 
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          ¿Ya tienes cuenta? <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Inicia sesión</span>
        </p>
      </div>
    </div>
  );
};

// Estilo de los inputs limpio (igual que Login)
const inputStyle = {
  width: '100%',
  padding: '16px 20px',
  borderRadius: '12px',
  border: '2px solid rgba(255, 255, 255, 0.4)',
  backgroundColor: 'transparent',
  color: 'white',
  fontSize: '16px',
  outline: 'none',
  boxSizing: 'border-box'
};

export default Register;