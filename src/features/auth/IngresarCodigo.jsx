import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import dashImage from '../../assets/images/dash.png';
import Toast from '../../components/common/Toast';

const IngresarCodigo = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '']);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleChange = (index, value) => {
    // Solo permitir números
    if (!/^\d*$/.test(value)) return;
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus al siguiente input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Retroceder al input anterior con backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que todos los campos estén llenos
    if (code.some(digit => digit === '')) {
      setError('Por favor ingresa el código completo de 4 dígitos');
      return;
    }
    
    setError('');
    navigate('/nueva-contrasena');
  };

  const handleResend = () => {
    setShowToast(true);
    setCode(['', '', '', '']);
    inputRefs[0].current.focus();
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
          message="Código reenviado exitosamente" 
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
          INGRESAR CÓDIGO
        </h1>

        {/* Formulario */}
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
          {/* 4 Recuadros para el código */}
          <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  maxLength="1"
                  value={code[index]}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'transparent',
                    color: 'white',
                    fontSize: '32px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              ))}
            </div>
            
            {/* Mensaje de error */}
            {error && (
              <p style={{
                color: '#ff4444',
                fontSize: '14px',
                marginTop: '12px',
                textAlign: 'center',
                fontWeight: '500'
              }}>
                {error}
              </p>
            )}
          </div>

          <button 
            type="submit"
            style={{
              width: '100%',
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
            Verificar
          </button>

          {/* Reenviar código */}
          <p 
            onClick={handleResend}
            style={{ 
              color: 'white', 
              fontSize: '14px', 
              cursor: 'pointer',
              textDecoration: 'underline',
              marginTop: '-10px'
            }}
          >
            Reenviar código
          </p>
        </form>
      </div>
    </div>
  );
};

export default IngresarCodigo;
