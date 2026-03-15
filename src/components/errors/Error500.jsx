import { motion } from 'framer-motion';
import { Home, RefreshCw, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ErrorPages.css';

const Error500 = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page-500">
      {/* Chispas eléctricas flotantes */}
      <div className="electric-sparks">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="spark"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              y: [0, -50, -100]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${50 + Math.random() * 50}%`,
            }}
          >
            ⚡
          </motion.div>
        ))}
      </div>

      <div className="error-content-500">
        {/* Gato electrocutado */}
        <div className="illustration-500">
          <motion.div 
            className="shocked-cat"
            animate={{
              x: [-2, 2, -2, 2, 0],
              rotate: [-1, 1, -1, 1, 0]
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              repeatDelay: 1
            }}
          >
            {/* Cuerpo del gato */}
            <div className="cat-body-500">
              {/* Cabeza */}
              <div className="cat-head-500">
                {/* Orejas */}
                <div className="cat-ear-500 left"></div>
                <div className="cat-ear-500 right"></div>
                
                {/* Cara */}
                <div className="cat-face-500">
                  {/* Ojos electrocutados */}
                  <motion.div 
                    className="cat-eye-500 left"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <div className="eye-spiral">@</div>
                  </motion.div>
                  <motion.div 
                    className="cat-eye-500 right"
                    animate={{ 
                      scale: [1, 1.3, 1],
                      rotate: [0, -180, -360]
                    }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    <div className="eye-spiral">@</div>
                  </motion.div>
                  
                  {/* Nariz y boca */}
                  <div className="cat-nose-500"></div>
                  <motion.div 
                    className="cat-mouth-500"
                    animate={{ scaleX: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  ></motion.div>
                </div>

                {/* Pelo parado */}
                <div className="shocked-fur">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="fur-strand"
                      animate={{ 
                        y: [-5, -10, -5],
                        rotate: [i * 10 - 40, i * 10 - 35, i * 10 - 40]
                      }}
                      transition={{ 
                        duration: 0.3,
                        repeat: Infinity,
                        delay: i * 0.05
                      }}
                      style={{ left: `${i * 12}%` }}
                    />
                  ))}
                </div>
              </div>

              {/* Cuerpo */}
              <div className="cat-torso-500"></div>

              {/* Patas temblando */}
              <div className="cat-legs-500">
                <motion.div 
                  className="cat-leg-500"
                  animate={{ scaleY: [1, 0.9, 1] }}
                  transition={{ duration: 0.2, repeat: Infinity }}
                ></motion.div>
                <motion.div 
                  className="cat-leg-500"
                  animate={{ scaleY: [1, 0.9, 1] }}
                  transition={{ duration: 0.2, repeat: Infinity, delay: 0.1 }}
                ></motion.div>
              </div>

              {/* Cola eléctrica */}
              <motion.div 
                className="cat-tail-500"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scaleY: [1, 1.1, 0.9, 1]
                }}
                transition={{ duration: 0.3, repeat: Infinity }}
              ></motion.div>
            </div>

            {/* Cables enredados */}
            <div className="tangled-cables">
              <motion.div 
                className="cable cable-1"
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              ></motion.div>
              <motion.div 
                className="cable cable-2"
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              ></motion.div>
              <motion.div 
                className="cable cable-3"
                animate={{ pathLength: [0, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              ></motion.div>
            </div>

            {/* Chispas alrededor del gato */}
            <div className="cat-sparks">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="mini-spark"
                  animate={{ 
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  ⚡
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Servidor humeante */}
          <div className="server-box">
            <div className="server-front">
              <div className="server-lights">
                <motion.div 
                  className="light red"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                ></motion.div>
                <motion.div 
                  className="light red"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                ></motion.div>
                <motion.div 
                  className="light red"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                ></motion.div>
              </div>
            </div>
            {/* Humo */}
            <div className="smoke-container">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="smoke"
                  animate={{ 
                    y: [0, -60],
                    opacity: [0.7, 0],
                    scale: [0.5, 1.5]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.8
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Texto del error */}
        <motion.div 
          className="error-text-500"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.h1 
            className="error-code-500"
            animate={{ 
              textShadow: [
                "0 0 10px #ff6b6b",
                "0 0 20px #ff6b6b",
                "0 0 10px #ff6b6b"
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            5<span className="zero-500">0</span>0
          </motion.h1>
          
          <h2 className="error-title-500">¡SERVIDOR ELECTROCUTADO!</h2>
          
          <p className="error-message-500">
            ¡Ups! Un gato curioso metió las patas donde no debía... ⚡<br/>
            <strong>¡Y ahora todo está en corto circuito!</strong>
          </p>

          <div className="error-subtitle-500">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              😱 Los cables nunca fueron buenos juguetes...
            </motion.span>
          </div>

          {/* Botones */}
          <div className="error-buttons-500">
            <motion.button
              className="btn-500 btn-reload"
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw size={22} />
              <span>Reintentar</span>
            </motion.button>
            
            <motion.button
              className="btn-500 btn-home-500"
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home size={22} />
              <span>Ir a Inicio</span>
            </motion.button>
          </div>

          {/* Mensaje divertido */}
          <motion.div 
            className="fun-message-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div className="speech-bubble-500">
              <p>"¡Miau! Solo quería jugar con los cables brillantes... 😿⚡"</p>
              <div className="bubble-arrow-500"></div>
            </div>
          </motion.div>

          {/* Status */}
          <motion.div 
            className="server-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <Zap size={18} className="zap-icon" />
            <span>Nuestro equipo está desconectando al gato del servidor...</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Error500;
