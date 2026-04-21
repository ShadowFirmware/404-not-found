import { useState, useRef, useEffect } from 'react';
import { Palette, ChevronDown, Check } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const { currentTheme, changeTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="theme-selector" ref={ref}>
      <div className="theme-selector-header" onClick={() => setOpen((o) => !o)}>
        <Palette size={18} />
        <span>Temas</span>
        <ChevronDown
          size={14}
          style={{ marginLeft: 'auto', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </div>

      {open && (
        <div className="theme-dropdown">
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
