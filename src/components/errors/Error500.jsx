import { motion } from 'framer-motion';
import { Home, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ErrorPages.css';

/* ─────────────────────────────────────────
   Floating lightning particles
   ───────────────────────────────────────── */
const BOLTS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 7.4 + 2) % 100}%`,
  top:  `${(i * 11 + 4) % 88}%`,
  size: 14 + (i % 4) * 6,
  dur:  2 + (i % 3) * 0.7,
  del:  i * 0.35,
}));

/* ─────────────────────────────────────────
   SVG Shocked Cat
   ───────────────────────────────────────── */
const ShockedCat = () => (
  <motion.div
    className="shocked-cat-wrap"
    animate={{ x: [-1, 1.5, -2, 2, -1, 1, 0], y: [0, -1, 1, -1, 0] }}
    transition={{ duration: 0.16, repeat: Infinity, repeatDelay: 0.5 }}
  >
    <svg viewBox="0 0 200 200" width="220" height="220" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      {/* Tail – zigzag/electric shape */}
      <path
        className="cat-tail-svg"
        d="M 35 158 Q 18 136 26 114 Q 36 92 18 72 Q 6 56 16 40"
        stroke="#c2590a" strokeWidth="12" fill="none"
        strokeLinecap="round" strokeLinejoin="round"
      />

      {/* Body */}
      <ellipse cx="118" cy="140" rx="52" ry="30" fill="#f97316"/>
      {/* Belly */}
      <ellipse cx="122" cy="146" rx="34" ry="20" fill="#fcd9b0"/>

      {/* Back legs (behind body) */}
      <g className="cat-bl"><rect x="76"  y="162" width="16" height="24" rx="6" fill="#c2590a"/></g>
      <g className="cat-br"><rect x="96"  y="162" width="16" height="24" rx="6" fill="#e86a10"/></g>
      {/* Front legs */}
      <g className="cat-fl"><rect x="134" y="162" width="16" height="24" rx="6" fill="#c2590a"/></g>
      <g className="cat-fr"><rect x="154" y="162" width="16" height="24" rx="6" fill="#e86a10"/></g>

      {/* Neck */}
      <ellipse cx="146" cy="118" rx="18" ry="16" fill="#f97316"/>

      {/* Head */}
      <ellipse cx="146" cy="84"  rx="38" ry="34" fill="#f97316"/>

      {/* Ears – pointy */}
      <polygon points="118,66 106,32 130,58" fill="#c2590a"/>
      <polygon points="120,64 110,40 128,56" fill="#fca5a5"/>
      <polygon points="168,66 180,32 158,58" fill="#c2590a"/>
      <polygon points="166,64 176,40 160,56" fill="#fca5a5"/>

      {/* Electric fur strands on top of head */}
      <g className="cat-fur">
        <rect x="122" y="42" width="6" height="20" rx="3" fill="#f97316" transform="rotate(-22 125 52)"/>
        <rect x="132" y="37" width="6" height="24" rx="3" fill="#f97316" transform="rotate(-9  135 49)"/>
        <rect x="143" y="35" width="6" height="26" rx="3" fill="#f97316" transform="rotate( 0  146 48)"/>
        <rect x="154" y="37" width="6" height="24" rx="3" fill="#f97316" transform="rotate( 9  157 49)"/>
        <rect x="163" y="42" width="6" height="20" rx="3" fill="#f97316" transform="rotate(22 166 52)"/>
      </g>

      {/* Eyes – shocked spirals */}
      <circle cx="130" cy="78" r="12" fill="white" stroke="#2c1810" strokeWidth="1.5"/>
      <text className="cat-eye-l" x="130" y="84" textAnchor="middle" fontSize="15" fill="#2c1810" fontWeight="900">@</text>
      <circle cx="162" cy="78" r="12" fill="white" stroke="#2c1810" strokeWidth="1.5"/>
      <text className="cat-eye-r" x="162" y="84" textAnchor="middle" fontSize="15" fill="#2c1810" fontWeight="900">@</text>

      {/* Nose */}
      <ellipse cx="146" cy="94" rx="5.5" ry="3.5" fill="#2c1810"/>

      {/* Mouth – shocked open oval */}
      <ellipse cx="146" cy="106" rx="10" ry="8" fill="#2c1810"/>
      <ellipse cx="146" cy="107" rx="6.5" ry="4.5" fill="#a34706"/>

      {/* Electric sparks around cat */}
      <text className="cat-spark-1" x="178" y="54"  fontSize="20">⚡</text>
      <text className="cat-spark-2" x="96"  y="60"  fontSize="17">⚡</text>
      <text className="cat-spark-3" x="182" y="120" fontSize="15">⚡</text>
      <text className="cat-spark-4" x="84"  y="122" fontSize="13">⚡</text>
      <text className="cat-spark-5" x="148" y="30"  fontSize="14">⚡</text>
    </svg>
  </motion.div>
);

/* ─────────────────────────────────────────
   Page
   ───────────────────────────────────────── */
const Error500 = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page-500-new">
      {/* Ambient lightning particles */}
      <div className="bolts-bg" aria-hidden>
        {BOLTS.map((b, i) => (
          <motion.span
            key={i}
            className="bolt-bg-item"
            style={{ left: b.left, top: b.top, fontSize: b.size }}
            animate={{ y: [0, -20, 0], opacity: [0.04, 0.14, 0.04] }}
            transition={{ duration: b.dur, repeat: Infinity, delay: b.del, ease: 'easeInOut' }}
          >⚡</motion.span>
        ))}
      </div>

      <div className="blob-500-1" />
      <div className="blob-500-2" />

      {/* Main layout */}
      <div className="error-layout-500">
        {/* Left: cat illustration */}
        <div className="error-illustration-col-500">
          <ShockedCat />
          <p className="cat-hint">
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ⚡ ¡Solo quería jugar con los cables!
            </motion.span>
          </p>
        </div>

        {/* Right: text */}
        <motion.div
          className="error-text-col-500"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="error-code-500-new"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            5<span className="zero-500-new">0</span>0
          </motion.h1>

          <div className="error-tag-500">Error del servidor</div>

          <h2 className="error-title-500-new">¡El servidor se electrocutó!</h2>

          <p className="error-message-500-new">
            Un gatito curioso metió las patas donde no debía y ahora
            todo está en cortocircuito. Nuestro equipo ya está
            desconectando al culpable del rack de servidores.
          </p>

          <div className="error-buttons-500-new">
            <motion.button
              className="btn-500-new btn-primary-500-new"
              onClick={() => window.location.reload()}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <RefreshCw size={20} /> Reintentar
            </motion.button>
            <motion.button
              className="btn-500-new btn-ghost-500-new"
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <Home size={20} /> Ir al inicio
            </motion.button>
          </div>

          <p className="error-hint-500">Error 500 · PawMatch</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Error500;
