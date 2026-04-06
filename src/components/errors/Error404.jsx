import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const PAWS = ['🐾', '🐾', '🐾', '🐾', '🐾', '🐾', '🐾', '🐾', '🐾', '🐾', '🐾', '🐾'];

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page-404">

      {/* Patas flotantes de fondo */}
      <div className="paws-bg">
        {PAWS.map((_, i) => (
          <motion.span
            key={i}
            className="paw-bg-item"
            style={{
              left: `${(i * 8.3) % 100}%`,
              top: `${(i * 13 + 5) % 90}%`,
              fontSize: `${16 + (i % 4) * 8}px`,
              rotate: `${(i * 37) % 360}deg`,
            }}
            animate={{ y: [0, -18, 0], opacity: [0.07, 0.18, 0.07] }}
            transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
          >
            🐾
          </motion.span>
        ))}
      </div>

      {/* Blob decorativo */}
      <div className="blob-1" />
      <div className="blob-2" />

      <div className="error-layout-404">

        {/* ── Columna izquierda: ilustración ── */}
        <div className="error-illustration-col">
          <motion.div
            className="dog-emoji-wrap"
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {/* Cuerpo del perro en emojis + CSS */}
            <div className="dog-emoji-scene">
              <motion.span
                className="dog-main-emoji"
                animate={{ rotate: [-4, 4, -4] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                🐕
              </motion.span>

              {/* Lupa animada */}
              <motion.div
                className="magnifier-wrap"
                animate={{ rotate: [-15, 15, -15], x: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Search size={52} strokeWidth={2.5} className="magnifier-icon" />
              </motion.div>

              {/* Burbuja de pensamiento */}
              <motion.div
                className="thought-bubble"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <motion.span
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                >
                  ¿Dónde está?
                </motion.span>
              </motion.div>
            </div>

            {/* Huellas debajo */}
            <div className="paw-trail-404">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className="trail-paw"
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
                >
                  🐾
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Columna derecha: texto ── */}
        <motion.div
          className="error-text-col"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* Número 404 */}
          <motion.h1
            className="error-code-404"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            4<span className="zero-404">0</span>4
          </motion.h1>

          <div className="error-tag">Página no encontrada</div>

          <h2 className="error-title-404">¡Esta página se escapó!</h2>

          <p className="error-message-404">
            Nuestro detective canino buscó por todas partes pero no pudo encontrar lo que buscas.
            Puede que la página haya cambiado de dirección o simplemente salió a pasear.
          </p>

          {/* Botones */}
          <div className="error-buttons-404">
            <motion.button
              className="btn-404 btn-primary-404"
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <Home size={20} />
              Ir al inicio
            </motion.button>

            <motion.button
              className="btn-404 btn-ghost-404"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <ArrowLeft size={20} />
              Regresar
            </motion.button>
          </div>

          {/* Código de error */}
          <motion.p
            className="error-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Error 404 · PawMatch
          </motion.p>
        </motion.div>

      </div>
    </div>
  );
};

export default Error404;
