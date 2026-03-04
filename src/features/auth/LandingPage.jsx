import { useNavigate } from 'react-router-dom';
import dashImage from '../../assets/images/dash.png';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="w-screen h-screen fixed inset-0 overflow-hidden"
      style={{ 
        backgroundColor: 'black',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${dashImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div 
        className="absolute z-20"
        style={{ 
          top: '50px',    
          left: '60px'
        }}
      >
        <div style={{ color: '#ffffff', fontSize: '32px', fontWeight: '900', letterSpacing: '-0.02em' }}>
          PAWMATCH
        </div>
      </div>

      <div 
        className="absolute z-20"
        style={{ 
          top: '50px',    
          right: '100px'
        }}
      >
        <button
          onClick={() => navigate('/login')}
          className="rounded-full font-bold transition-all hover:bg-gray-100 active:scale-95 shadow-lg"
          style={{
            backgroundColor: '#ffffff', 
            color: '#2a2d34',          
            padding: '12px 35px',
            fontSize: '18px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Iniciar sesión
        </button>
      </div>

      {/* CONTENIDO CENTRAL */}
      <div className="h-full w-full flex flex-col items-center justify-center px-4 pt-20">
        <h1 
          className="font-black text-center"
          style={{
            color: '#ffffff', 
            fontSize: 'clamp(3rem, 10vw, 8.5rem)', 
            lineHeight: '1',
            letterSpacing: '-0.04em',
            textShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
            margin: '0 0 100px 0' 
          }}
        >
          TU PAREJA PURRRRRFECTA<sup style={{ fontSize: '0.4em', verticalAlign: 'super' }}>™</sup>
        </h1>

        <button
          onClick={() => navigate('/register')}
          className="font-bold rounded-full transition-all shadow-2xl hover:scale-105 active:scale-95"
          style={{
            backgroundImage: 'linear-gradient(90deg, #ff1e77 0%, #ff6b3d 100%)', 
            color: '#ffffff', 
            padding: '20px 80px', 
            fontSize: '24px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Crear cuenta
        </button>
      </div>
    </div>
  );
};

export default LandingPage;