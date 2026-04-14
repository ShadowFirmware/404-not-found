import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import dashImage from '../../assets/images/dash.png';

const LocationPermission = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAllowLocation = () => {
    setLoading(true);
    setError('');

    if (!('geolocation' in navigator)) {
      setLoading(false);
      setError('Tu navegador no soporta geolocalización.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await authService.updateLocation(
            position.coords.latitude,
            position.coords.longitude
          );
        } catch {
          // No bloqueamos la navegación si falla el guardado de ubicación
        } finally {
          navigate('/dashboard');
        }
      },
      (geoError) => {
        setLoading(false);
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError('Permiso denegado. Puedes habilitarlo más tarde en configuración.');
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError('Ubicación no disponible. Verifica tu conexión.');
            break;
          case geoError.TIMEOUT:
            setError('Tiempo de espera agotado. Intenta de nuevo.');
            break;
          default:
            setError('Error al obtener ubicación.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh', zIndex: 99999,
        backgroundColor: 'black',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url(${dashImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'flex-start', /* ✅ Permite scroll desde arriba */
        margin: 0, 
        padding: '80px 20px 40px', /* ✅ Espacio para logo + scroll inferior */
        overflowY: 'auto', /* ✅ Scroll vertical activado */
        overflowX: 'hidden',
      }}
    >
      {/* Logo fijo arriba */}
      <div style={{ position: 'absolute', top: '20px', left: '60px', zIndex: 100001 }}>
        <span style={{ color: 'white', fontSize: '28px', fontWeight: '900', letterSpacing: '-1px' }}>PAWMATCH</span>
      </div>

      {/* Contenido con scroll */}
      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        zIndex: 100000,
        paddingBottom: '40px' /* ✅ Espacio extra al final del scroll */
      }}>
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg,#ff1e77 0%,#ff6b3d 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '40px', boxShadow: '0 20px 40px rgba(255,30,119,0.4)' }}
        >
          <MapPin size={60} color="white" strokeWidth={2.5} />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ color: 'white', fontSize: '42px', fontWeight: '900', marginBottom: '20px', textAlign: 'center', letterSpacing: '-1px', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
          Encuentra Mascotas Cerca
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ color: 'rgba(255,255,255,0.9)', fontSize: '18px', lineHeight: '1.6', textAlign: 'center', marginBottom: '40px', maxWidth: '400px' }}>
          Necesitamos tu ubicación para mostrarte mascotas cercanas y conectarte con otros dueños en tu área.
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={{ width: '100%', marginBottom: '40px' }}>
          {[
            { icon: '🐕', text: 'Encuentra mascotas en tu zona' },
            { icon: '📍', text: 'Distancia en tiempo real' },
            { icon: '🎯', text: 'Matches más precisos' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', marginBottom: '12px', backdropFilter: 'blur(10px)' }}>
              <span style={{ fontSize: '28px' }}>{item.icon}</span>
              <span style={{ color: 'white', fontSize: '16px', fontWeight: '500' }}>{item.text}</span>
            </div>
          ))}
        </motion.div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{ width: '100%', padding: '15px', background: 'rgba(239,68,68,0.2)', border: '2px solid rgba(239,68,68,0.5)', borderRadius: '12px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} color="#ef4444" />
            <span style={{ color: '#fca5a5', fontSize: '14px' }}>{error}</span>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button
            onClick={handleAllowLocation}
            disabled={loading}
            style={{ width: '100%', padding: '18px', borderRadius: '30px', border: 'none', backgroundImage: loading ? 'none' : 'linear-gradient(90deg,#ff1e77 0%,#ff6b3d 100%)', backgroundColor: loading ? '#666' : undefined, color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 10px 20px rgba(255,30,119,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          >
            {loading ? (
              <>
                <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                Obteniendo ubicación...
              </>
            ) : (
              <><Navigation size={20} /> Permitir Ubicación</>
            )}
          </button>

          <button
            onClick={handleSkip}
            disabled={loading}
            style={{ width: '100%', padding: '18px', borderRadius: '30px', border: '2px solid rgba(255,255,255,0.4)', background: 'transparent', color: 'white', fontWeight: 'bold', fontSize: '18px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}
          >
            Más Tarde
          </button>
        </motion.div>

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', textAlign: 'center', marginTop: '30px', lineHeight: '1.5' }}>
          Tu ubicación solo se usa para mostrar distancias.<br />
          Puedes cambiar esto en cualquier momento desde configuración.
        </p>
      </div>

      <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
    </div>
  );
};

export default LocationPermission;