import { Home, Heart, MessageCircle, Settings, PawPrint } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import './Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'pets', label: 'Mis Mascotas', icon: PawPrint },
    { id: 'matches', label: 'Matches', icon: Heart },
    { id: 'chats', label: 'Mensajes', icon: MessageCircle },
    { id: 'settings', label: 'Configuración de Perfil', icon: Settings }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <span className="logo-text">PAWMATCH</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <ThemeSelector />
    </div>
  );
};

export default Sidebar;
