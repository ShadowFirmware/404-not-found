import { useState } from 'react';
import { Palette, ChevronDown } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const { currentTheme, changeTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const themeVisuals = {
    normal: { bg: '#ffffff', text: '#000000' },
    dark:   { bg: '#1a1a2e', text: '#ffffff' },
    blue:   { bg: '#ffffff', text: '#3b82f6' },
    pink:   { bg: '#ffffff', text: '#ec4899' }
  };

  const active = themeVisuals[currentTheme] || themeVisuals.normal;

  const handleThemeChange = (e) => {
    changeTheme(e.target.value);
    setOpen(false);
  };

  return (
    <div className="theme-selector">
      <div
        className="theme-selector-header"
        onClick={() => setOpen((o) => !o)}
        style={{ cursor: 'pointer' }}
      >
        <Palette size={18} style={{ color: active.text }} />
        <span style={{ color: active.text }}>Temas</span>
        <ChevronDown
          size={14}
          style={{
            color: active.text,
            marginLeft: 'auto',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </div>

      {open && (
        <select
          className="theme-select"
          value={currentTheme}
          onChange={handleThemeChange}
          aria-label="Seleccionar tema"
          autoFocus
          onBlur={() => setOpen(false)}
          size={Object.keys(themes).length}
          style={{
            backgroundColor: active.bg,
            color: active.text,
            borderColor: active.text,
          }}
        >
          {Object.keys(themes).map((themeKey) => (
            <option key={themeKey} value={themeKey}>
              {themes[themeKey].name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default ThemeSelector;
