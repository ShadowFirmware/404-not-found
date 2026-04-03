import { useState, useEffect, useRef } from 'react';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './ErrorPages.css';

/* ─────────────────────────────────────────
   CSS Dog character
   ───────────────────────────────────────── */
const Dog = ({ pose, facingLeft }) => (
  <div
    className={`css-dog pose-${pose}`}
    style={{ transform: facingLeft ? 'scaleX(-1)' : undefined }}
  >
    {/* Tail */}
    <div className="d-tail" />

    {/* Body */}
    <div className="d-body" />

    {/* Head group – rotates down when sniffing */}
    <div className="d-head-group">
      <div className="d-head">
        <div className="d-ear" />
        <div className="d-eye" />
        <div className="d-pupil" />
        <div className="d-nose" />
        {/* Sniff particles */}
        <div className="d-sniff-1" />
        <div className="d-sniff-2" />
        <div className="d-sniff-3" />
      </div>
    </div>

    {/* Legs */}
    <div className="d-leg d-fl" />
    <div className="d-leg d-fr" />
    <div className="d-leg d-bl" />
    <div className="d-leg d-br" />
  </div>
);

/* ─────────────────────────────────────────
   Walking dog with full movement sequence
   ───────────────────────────────────────── */
const WalkingDog = () => {
  const controls    = useAnimationControls();
  const [pose, setPose]           = useState('walk');
  const [facingLeft, setFacingLeft] = useState(false);
  const [fourthWall, setFourthWall] = useState(false);
  const mounted = useRef(true);

  useEffect(() => () => { mounted.current = false; }, []);

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const run = async () => {
    if (!mounted.current) return;

    /* ── 1. Enter from the left ── */
    controls.set({ x: -180, y: 0, scale: 1 });
    setFacingLeft(false);
    setPose('walk');
    await controls.start({ x: '18vw', transition: { duration: 3.8, ease: 'linear' } });

    /* ── 2. Sniff near the floor ── */
    setPose('sniff');
    await wait(2200);

    /* ── 3. Walk to center ── */
    setPose('walk');
    await controls.start({ x: '52vw', transition: { duration: 3.2, ease: 'linear' } });

    /* ── 4. Sniff again ── */
    setPose('sniff');
    await wait(1800);

    /* ── 5. FOURTH WALL: dog walks towards the camera ── */
    if (!mounted.current) return;
    setPose('walk');
    setFourthWall(true);
    await controls.start({
      scale: 3.6,
      y: 60,
      transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
    });

    /* ── 6. Nose pressed on screen – dog sniffs the user ── */
    setPose('sniff');
    await wait(3000);

    /* ── 7. Back away ── */
    setPose('walk');
    await controls.start({
      scale: 1,
      y: 0,
      transition: { duration: 1.4, ease: 'easeOut' },
    });
    setFourthWall(false);

    /* ── 8. Turn around and walk left ── */
    if (!mounted.current) return;
    setFacingLeft(true);
    await controls.start({ x: '8vw', transition: { duration: 4, ease: 'linear' } });

    /* ── 9. Sniff corner ── */
    setPose('sniff');
    await wait(1600);

    /* ── 10. Walk right again, then off screen ── */
    setFacingLeft(false);
    setPose('walk');
    await controls.start({ x: 'calc(100vw + 200px)', transition: { duration: 5.5, ease: 'linear' } });

    /* ── Loop ── */
    if (mounted.current) run();
  };

  useEffect(() => {
    const t = setTimeout(run, 600);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line

  return (
    <>
      {/* Fourth-wall overlay */}
      <AnimatePresence>
        {fourthWall && (
          <motion.div
            className="fw-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Fog breath */}
            <motion.div
              className="fw-fog"
              animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            />
            {/* Nose smudge */}
            <div className="fw-nose-smudge" />
            {/* Speech bubble */}
            <motion.div
              className="fw-bubble"
              initial={{ opacity: 0, y: 20, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
            >
              ¡Te encontré! 🐾
              <div className="fw-bubble-arrow" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The dog */}
      <motion.div
        animate={controls}
        style={{
          position: 'fixed',
          bottom: '7%',
          left: 0,
          zIndex: 45,
          transformOrigin: 'center bottom',
          pointerEvents: 'none',
        }}
      >
        <Dog pose={pose} facingLeft={facingLeft} />
      </motion.div>
    </>
  );
};

/* ─────────────────────────────────────────
   Floating paw prints
   ───────────────────────────────────────── */
const PAWS = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 8.3) % 100}%`,
  top:  `${(i * 13 + 5) % 90}%`,
  size: 16 + (i % 4) * 8,
  rot:  (i * 37) % 360,
  dur:  4 + (i % 3),
  del:  i * 0.4,
}));

/* ─────────────────────────────────────────
   Page
   ───────────────────────────────────────── */
const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="error-page-404">
      {/* Ambient paw prints */}
      <div className="paws-bg" aria-hidden>
        {PAWS.map((p, i) => (
          <motion.span
            key={i}
            className="paw-bg-item"
            style={{ left: p.left, top: p.top, fontSize: p.size, rotate: `${p.rot}deg` }}
            animate={{ y: [0, -18, 0], opacity: [0.06, 0.16, 0.06] }}
            transition={{ duration: p.dur, repeat: Infinity, delay: p.del, ease: 'easeInOut' }}
          >🐾</motion.span>
        ))}
      </div>

      <div className="blob-1" />
      <div className="blob-2" />

      {/* Walking dog */}
      <WalkingDog />

      {/* Main content */}
      <div className="error-layout-404">
        {/* Left: static decorative paws */}
        <div className="error-illustration-col">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="paw-circle"
          >
            <span className="paw-big">🐾</span>
          </motion.div>

          <p className="dog-hint">
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              👀 Espera… ¿lo ves?
            </motion.span>
          </p>
        </div>

        {/* Right: text */}
        <motion.div
          className="error-text-col"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="error-code-404"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            4<span className="zero-404">0</span>4
          </motion.h1>

          <div className="error-tag">Página no encontrada</div>

          <h2 className="error-title-404">¡Esta página se escapó!</h2>

          <p className="error-message-404">
            Mandamos a nuestro detective canino a buscarla por toda la pantalla…
            pero parece que ni él la puede encontrar. Revisa la URL o vuelve al inicio.
          </p>

          <div className="error-buttons-404">
            <motion.button
              className="btn-404 btn-primary-404"
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <Home size={20} /> Ir al inicio
            </motion.button>
            <motion.button
              className="btn-404 btn-ghost-404"
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.96 }}
            >
              <ArrowLeft size={20} /> Regresar
            </motion.button>
          </div>

          <p className="error-hint">Error 404 · PawMatch</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Error404;
