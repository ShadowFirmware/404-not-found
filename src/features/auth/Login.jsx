import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import dashImage from '../../assets/images/dash.png';

const Login = () => {
  const navigate = useNavigate();
  const { login, setUserFromStorage } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const data = await authService.googleLogin(tokenResponse.access_token);
        setUserFromStorage();
        navigate(data.is_new_user ? '/location-permission' : '/dashboard');
      } catch (err) {
        setError(err?.response?.data?.access_token?.[0] || err?.response?.data?.detail || 'Error al iniciar sesión con Google.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('No se pudo abrir Google. Intenta de nuevo.'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err?.response?.data?.non_field_errors?.[0] ||
        err?.response?.data?.detail ||
        'Credenciales inválidas. Verifica tu email y contraseña.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        backgroundColor: 'black',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)),url(${dashImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 0, padding: 0, overflow: 'hidden',
      }}
    >
      <div style={{ width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '48px', fontWeight: '900', marginBottom: '40px', textAlign: 'center', letterSpacing: '-1px', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
          INICIAR SESIÓN
        </h1>

        {error && (
          <div style={{ width: '100%', padding: '12px 16px', marginBottom: '16px', borderRadius: '10px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#fca5a5', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            style={inputStyle}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '10px', padding: '18px', borderRadius: '30px', border: 'none',
              backgroundImage: loading ? 'none' : 'linear-gradient(90deg,#ff1e77 0%,#ff6b3d 100%)',
              backgroundColor: loading ? '#666' : undefined,
              color: 'white', fontWeight: 'bold', fontSize: '18px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 10px 20px rgba(255,30,119,0.3)',
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p onClick={() => navigate('/recuperar-contrasena')} style={{ color: 'white', marginTop: '20px', fontSize: '14px', textDecoration: 'underline', cursor: 'pointer' }}>
          ¿Olvidaste tu contraseña?
        </p>

        <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginTop: '30px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <span style={{ color: 'white', padding: '0 15px', fontSize: '14px' }}>O entra con</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.3)' }} />
        </div>

        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => handleGoogleLogin()}
            disabled={loading}
            title="Continuar con Google"
            style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ffffff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', opacity: loading ? 0.6 : 1 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          </button>
        </div>

        <p onClick={() => navigate('/register')} style={{ color: 'white', marginTop: '35px', fontSize: '14px', cursor: 'pointer' }}>
          ¿No tienes cuenta? <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Regístrate</span>
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

export default Login;
