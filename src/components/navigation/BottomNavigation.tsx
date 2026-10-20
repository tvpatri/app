import React from 'react';
import { useEmoti, MainNavTab } from '../../context/EmotiContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Bot, 
  Users, 
  Sparkles, 
  User
} from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, devices } = useEmoti();
  const { incomingRequests } = useAuth();

  const isConnected = devices.bot.connected && devices.band.connected;

  const navItems: { 
    id: MainNavTab; 
    label: string; 
    icon: React.ComponentType<any>; 
    badge?: number;
    color: string;
  }[] = [
    { id: 'home', label: 'Inicio', icon: Home, color: 'from-[#FFD65A] to-[#FF936F]' },
    { id: 'devices', label: 'Dispositivos', icon: Bot, color: 'from-[#79B9F2] to-[#B69AF5]' },
    { id: 'circle', label: 'Mi Círculo', icon: Users, badge: incomingRequests.length, color: 'from-[#FF80B5] to-[#FF936F]' },
    { id: 'emotiapp', label: 'EmotiApp', icon: Sparkles, color: 'from-[#72D6B1] to-[#79B9F2]' },
    { id: 'profile', label: 'Perfil', icon: User, color: 'from-[#B69AF5] to-[#FF80B5]' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFF9F0]/95 backdrop-blur-md border-t-2 border-[#FFD65A]/40 px-3 py-2.5 shadow-[0_-8px_25px_-5px_rgba(40,36,58,0.08)]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 relative group active:scale-95 ${
                isActive
                  ? 'text-[#28243A] font-extrabold'
                  : 'text-[#28243A]/60 hover:text-[#28243A]'
              }`}
            >
              <div 
                className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? `bg-gradient-to-tr ${item.color} shadow-[0_4px_12px_rgba(255,147,111,0.3)] text-white scale-110` 
                    : 'group-hover:bg-[#FFF2DE]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                {item.id === 'devices' && (
                  <span
                    className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#FFF9F0] ${
                      isConnected ? 'bg-[#72D6B1]' : 'bg-[#FFD65A]'
                    }`}
                  />
                )}
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 px-1.5 py-0.2 bg-[#FF80B5] text-white font-black text-[9px] rounded-full border-2 border-[#FFF9F0] shadow-xs">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className={`text-[10px] tracking-tight ${isActive ? 'text-[#28243A] font-black' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
