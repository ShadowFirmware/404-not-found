import { Palette } from 'lucide-react';
import { useTheme, themes } from '../../context/ThemeContext';
import './ThemeSelector.css';

const ThemeSelector = () => {
  const { currentTheme, changeTheme } = useTheme();

  const themeColors = {
    normal: '#FF6B6B',
    dark: '#1a1a2e',
    blue: '#3b82f6',
    pink: '#ec4899'
  };

  return (
    <div className="theme-selector">
      <div className="theme-selector-header">
        <Palette size={18} />
        <span>Temas</span>
      </div>
      <div className="theme-options">
        {Object.keys(themes).map((themeKey) => (
          <button
            key={themeKey}
            className={`theme-option ${currentTheme === themeKey ? 'active' : ''}`}
            onClick={() => changeTheme(themeKey)}
            title={themes[themeKey].name}
          >
            <div 
              className="theme-color-preview" 
              style={{ backgroundColor: themeColors[themeKey] }}
            />
            <span className="theme-name">{themes[themeKey].name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;
