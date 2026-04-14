import { useEffect, useRef, useCallback } from 'react';

const INACTIVE_MS  = 15 * 60 * 1000;  // 15 minutos
const WARNING_MS   = 14 * 60 * 1000;  // aviso al minuto 14

/**
 * Cierra sesión automáticamente tras 15 min sin actividad.
 * Dispara onWarn al minuto 14 para que el UI muestre un aviso.
 * Se reinicia con cualquier interacción del usuario.
 */
const useInactivityTimer = (onLogout, onWarn, enabled = true) => {
  const logoutRef  = useRef(null);
  const warnRef    = useRef(null);
  const onLogoutCb = useRef(onLogout);
  const onWarnCb   = useRef(onWarn);

  // Mantener refs actualizadas sin re-crear el effect
  useEffect(() => { onLogoutCb.current = onLogout; }, [onLogout]);
  useEffect(() => { onWarnCb.current  = onWarn;   }, [onWarn]);

  const reset = useCallback(() => {
    clearTimeout(logoutRef.current);
    clearTimeout(warnRef.current);

    warnRef.current   = setTimeout(() => onWarnCb.current?.(),   WARNING_MS);
    logoutRef.current = setTimeout(() => onLogoutCb.current?.(), INACTIVE_MS);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const EVENTS = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    EVENTS.forEach((e) => window.addEventListener(e, reset, { passive: true }));

    reset(); // arrancar el timer al montar

    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, reset));
      clearTimeout(logoutRef.current);
      clearTimeout(warnRef.current);
    };
  }, [reset, enabled]);
};

export default useInactivityTimer;
