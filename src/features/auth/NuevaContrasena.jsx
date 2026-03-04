import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dashImage from '../../assets/images/dash.png';
import Toast from '../../components/common/Toast';

const NuevaContrasena = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowToast(true);
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'black',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${dashImage})`,
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
          message="Contraseña restablecida exitosamente" 
          type="success" 
          onClose={() => setShowToast(false)} 
        />
      )}

      {/* MODAL CENTRAL */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        
        {/* Título */}
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
          NUEVA CONTRASEÑA
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Nueva contraseña */}
          <div style={{ position: 'relative' }}>
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Nueva contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Ver 
            </button>
          </div>

          {/* Confirmar contraseña */}
          <div style={{ position: 'relative' }}>
            <input 
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={inputStyle} 
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              Ver 
            </button>
          </div>

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
            Restablecer
          </button>
        </form>
      </div>
    </div>
  );
};

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

export default NuevaContrasena;
