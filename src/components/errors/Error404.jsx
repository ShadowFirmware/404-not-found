import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page-404">
      {/* Estrellas flotantes */}
      <div className="stars">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="star"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="error-content-404">
        {/* Perro detective con lupa */}
        <div className="illustration-404">
          {/* Perro */}
          <motion.div 
            className="detective-dog"
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="dog-body">
              {/* Cabeza */}
              <div className="dog-head">
                <div className="dog-ear left"></div>
                <div className="dog-ear right"></div>
                <div className="dog-face">
                  <motion.div 
                    className="dog-eye left"
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div 
                    className="dog-eye right"
                    animate={{ scaleY: [1, 0.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="dog-nose"></div>
                  <div className="dog-mouth"></div>
                </div>
              </div>
              {/* Cuerpo */}
              <div className="dog-torso"></div>
              {/* Patas */}
              <div className="dog-legs">
                <div className="dog-leg"></div>
                <div className="dog-leg"></div>
              </div>
            </div>

            {/* Lupa animada */}
            <motion.div 
              className="magnifying-glass"
              animate={{
                rotate: [0, -10, 10, -10, 0],
                x: [0, 5, -5, 5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="glass-lens">
                <motion.div 
                  className="glass-shine"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <div className="glass-handle"></div>
            </motion.div>

            {/* Sombrero detective */}
            <div className="detective-hat">
              <div className="hat-top"></div>
              <div className="hat-brim"></div>
            </div>
          </motion.div>

          {/* Huellas animadas */}
          <div className="paw-trail">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="paw-print-trail"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              >
                🐾
              </motion.div>
            ))}
          </div>
        </div>

        {/* Texto del error */}
        <motion.div 
          className="error-text-404"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.h1 
            className="error-code-404"
            animate={{ 
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            4<span className="zero-404">0</span>4
          </motion.h1>
          
          <h2 className="error-title-404">¡PÁGINA PERDIDA!</h2>
          
          <p className="error-message-404">
            Nuestro detective canino ha buscado por todas partes pero... 🔍<br/>
            <strong>¡Esta página se escapó!</strong>
          </p>

          <div className="error-subtitle-404">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              😅 Parece que alguien dejó la puerta abierta...
            </motion.span>
          </div>

          {/* Botones */}
          <div className="error-buttons-404">
            <motion.button
              className="btn-404 btn-home"
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={22} />
              <span>Volver a Casa</span>
            </motion.button>
            
            <motion.button
              className="btn-404 btn-back"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={22} />
              <span>Regresar</span>
            </motion.button>
          </div>

          {/* Mensaje divertido */}
          <motion.div 
            className="fun-message-404"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="speech-bubble">
              <p>"¡Guau! He olido por todos lados y no encuentro esta página... 🐕"</p>
              <div className="bubble-arrow"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Error404;
