import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Palette, ChevronDown, Check } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';
import './ThemeSelector.css';

const MOBILE_BP = 640;
const MOBILE_NAV_H = 60;

const ThemeSelector = () => {
  const { currentTheme, changeTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ bottom: 0, left: 0 });
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        headerRef.current && !headerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    if (!open && headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= MOBILE_BP;
      const dropdownWidth = 170;

      let left = rect.left;
      if (left + dropdownWidth > window.innerWidth - 8) left = window.innerWidth - dropdownWidth - 8;
      left = Math.max(8, left);

      // Mobile: abre hacia arriba con valor fijo sobre el nav bar (evita diferencias entre
      // layout viewport y visual viewport de browsers móviles).
      // Desktop: calcula dinámicamente desde el borde superior del botón.
      const bottom = isMobile
        ? MOBILE_NAV_H + 4
        : window.innerHeight - rect.top + 4;

      setPos({ bottom, left });
    }
    setOpen((o) => !o);
  };

  // El portal renderiza fuera de .dashboard, así que pasamos las CSS vars del tema directamente.
  const themeVars = {
    '--card-bg': theme.cardBg,
    '--border-color': theme.border,
    '--text-color': theme.text,
    '--hover-color': theme.hover,
    '--primary-color': theme.primary,
  };

  return (
    <div className="theme-selector">
      <div className="theme-selector-header" ref={headerRef} onClick={handleToggle}>
        <Palette size={18} />
        <span className="theme-selector-label">Temas</span>
        <ChevronDown
          className="theme-selector-chevron"
          size={14}
          style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </div>

      {open && createPortal(
        <div
          ref={dropdownRef}
          className="theme-dropdown"
          style={{ position: 'fixed', bottom: pos.bottom, left: pos.left, ...themeVars }}
        >
          {Object.entries(themes).map(([key, t]) => (
            <div
              key={key}
              className={`theme-option ${currentTheme === key ? 'active' : ''}`}
              onClick={() => { changeTheme(key); setOpen(false); }}
            >
              <div className="theme-option-dot" style={{ backgroundColor: t.primary }} />
              <span>{t.name}</span>
              {currentTheme === key && <Check size={14} style={{ marginLeft: 'auto' }} />}
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
};

export default ThemeSelector;
