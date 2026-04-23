import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Palette, ChevronDown, Check } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const { currentTheme, changeTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0, bottom: 0, left: 0, isMobile: false });
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(e.target))
      ) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    if (!open && headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= 640;
      if (isMobile) {
        // Mobile: comportamiento original (abre hacia abajo con top+right)
        setPos({ top: rect.top, right: window.innerWidth - rect.right, isMobile: true });
      } else {
        // Desktop: abre hacia arriba desde el botón
        const dropdownWidth = 170;
        let left = rect.left;
        if (left + dropdownWidth > window.innerWidth - 8) left = window.innerWidth - dropdownWidth - 8;
        setPos({ bottom: window.innerHeight - rect.top + 4, left: Math.max(8, left), isMobile: false });
      }
    }
    setOpen((o) => !o);
  };

  const options = Object.entries(themes).map(([key, t]) => (
    <div
      key={key}
      className={`theme-option ${currentTheme === key ? 'active' : ''}`}
      onClick={() => { changeTheme(key); setOpen(false); }}
    >
      <div className="theme-option-dot" style={{ backgroundColor: t.primary }} />
      <span>{t.name}</span>
      {currentTheme === key && <Check size={14} style={{ marginLeft: 'auto' }} />}
    </div>
  ));

  return (
    <div className="theme-selector" ref={containerRef}>
      <div className="theme-selector-header" ref={headerRef} onClick={handleToggle}>
        <Palette size={18} />
        <span className="theme-selector-label">Temas</span>
        <ChevronDown
          className="theme-selector-chevron"
          size={14}
          style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </div>

      {open && (pos.isMobile
        // Mobile: dropdown normal dentro del componente (funciona con el nav fijo)
        ? <div className="theme-dropdown" style={{ position: 'fixed', top: pos.top + 36, right: pos.right }}>{options}</div>
        // Desktop: portal para escapar el overflow:hidden del sidebar sticky
        : createPortal(
            <div
              ref={dropdownRef}
              className="theme-dropdown"
              style={{
                position: 'fixed',
                bottom: pos.bottom,
                left: pos.left,
                '--card-bg': theme.cardBg,
                '--border-color': theme.border,
                '--text-color': theme.text,
                '--hover-color': theme.hover,
                '--primary-color': theme.primary,
              }}
            >{options}</div>,
            document.body
          )
      )}
    </div>
  );
};

export default ThemeSelector;
