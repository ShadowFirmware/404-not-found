import { Palette } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const { currentTheme, changeTheme } = useTheme();

  // Configuración visual por tema: fondo y texto
  const themeVisuals = {
    normal: { bg: '#ffffff', text: '#000000' },
    dark:   { bg: '#1a1a2e', text: '#ffffff' },
    blue:   { bg: '#ffffff', text: '#3b82f6' },
    pink:   { bg: '#ffffff', text: '#ec4899' }
  };

  const active = themeVisuals[currentTheme] || themeVisuals.normal;

  const handleThemeChange = (e) => {
    changeTheme(e.target.value);
  };

  return (
    <div className="theme-selector">
      <div className="theme-selector-header">
        <Palette size={18} style={{ color: active.text }} />
        <span style={{ color: active.text }}>Temas</span>
        <div 
          className="theme-current-indicator"
          style={{ 
            backgroundColor: active.text,
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            marginLeft: 'auto'
          }}
        />
      </div>
      
      <select 
        className="theme-select"
        value={currentTheme}
        onChange={handleThemeChange}
        aria-label="Seleccionar tema"
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
    </div>
  );
};

export default ThemeSelector;