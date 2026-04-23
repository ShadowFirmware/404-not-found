import { useState, useRef, useEffect } from 'react';
import { Palette, ChevronDown, Check } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const { currentTheme, changeTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0, width: 0 });
  const headerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleToggle = () => {
    if (!open && headerRef.current) {
      const rect = headerRef.current.getBoundingClientRect();
      setPos({ top: rect.top, right: window.innerWidth - rect.right, width: rect.width });
    }
    setOpen((o) => !o);
  };

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

      {open && (
        <div
          className="theme-dropdown"
          style={{
            position: 'fixed',
            top: pos.top + 36,
            right: pos.right,
          }}
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
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
