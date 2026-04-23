import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Palette, ChevronDown, Check } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const { currentTheme, changeTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ bottom: 0, left: 0 });
  const headerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (
        headerRef.current && !headerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    if (!open && headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      const dropdownWidth = 170;
      let left = rect.left;
      if (left + dropdownWidth > window.innerWidth - 8) {
        left = window.innerWidth - dropdownWidth - 8;
      }
      setPos({
        bottom: window.innerHeight - rect.top + 4,
        left: Math.max(8, left),
      });
    }
    setOpen((o) => !o);
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
          style={{ position: 'fixed', bottom: pos.bottom, left: pos.left }}
        >
          {Object.entries(themes).map(([key, theme]) => (
            <div
              key={key}
              className={`theme-option ${currentTheme === key ? 'active' : ''}`}
              onClick={() => { changeTheme(key); setOpen(false); }}
            >
              <div className="theme-option-dot" style={{ backgroundColor: theme.primary }} />
              <span>{theme.name}</span>
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
