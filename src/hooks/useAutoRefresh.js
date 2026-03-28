import { useEffect, useRef } from 'react';

/**
 * Llama a `callback` cada `intervalMs` mientras el componente está montado.
 * También lo llama inmediatamente en el primer render.
 */
const useAutoRefresh = (callback, intervalMs = 30000, enabled = true) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    savedCallback.current(); // llamada inmediata

    const id = setInterval(() => savedCallback.current(), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled]);
};

export default useAutoRefresh;
