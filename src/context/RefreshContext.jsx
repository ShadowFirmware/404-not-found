import { createContext, useContext, useRef, useCallback, useEffect } from 'react';

const RefreshContext = createContext(null);

/**
 * Bus de eventos global para refrescos inmediatos.
 * Tipos usados: 'stats', 'activity', 'matches', 'conversations'
 * Llamar triggerRefresh('stats') notifica a todos los suscriptores de 'stats'.
 */
export const RefreshProvider = ({ children }) => {
  const listenersRef = useRef({});

  /** Registra un callback para un tipo de evento. Devuelve la función de limpieza. */
  const subscribe = useCallback((type, callback) => {
    const map = listenersRef.current;
    if (!map[type]) map[type] = new Set();
    map[type].add(callback);
    return () => map[type].delete(callback);
  }, []);

  /** Dispara todos los callbacks registrados para ese tipo. */
  const triggerRefresh = useCallback((type = 'all') => {
    const map = listenersRef.current;
    map[type]?.forEach((cb) => cb());
    if (type !== 'all') map['all']?.forEach((cb) => cb());
  }, []);

  return (
    <RefreshContext.Provider value={{ triggerRefresh, subscribe }}>
      {children}
    </RefreshContext.Provider>
  );
};

export const useRefresh = () => useContext(RefreshContext);

/**
 * Hook para suscribirse a un tipo de refresco.
 * Cada vez que se llame triggerRefresh(type), se ejecuta `callback`.
 */
export const useRefreshOn = (type, callback) => {
  const ctx = useContext(RefreshContext);
  const cbRef = useRef(callback);
  cbRef.current = callback;

  useEffect(() => {
    if (!ctx) return;
    const stable = () => cbRef.current();
    return ctx.subscribe(type, stable);
  }, [type, ctx]);
};
