import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dashImage from '../../assets/images/dash.png';
import Toast from '../../components/common/Toast';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que todos los campos estén llenos
    if (formData.username && formData.email && formData.password) {
      setShowToast(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
          marginBottom: '40px',
          textAlign: 'center',
          letterSpacing: '-1px',
          textShadow: '0 4px 10px rgba(0,0,0,0.5)',
          whiteSpace: 'nowrap'
        }}>
          CREAR CUENTA
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <input 
            type="text"
            name="username"
            placeholder="Nombre de usuario"
            value={formData.username}
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
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle} 
          />

          <button 
            type="submit"
            style={{
              marginTop: '10px',
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
            Registrarse
          </button>
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