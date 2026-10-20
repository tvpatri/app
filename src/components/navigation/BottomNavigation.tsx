import React from 'react';
import { useEmoti, MainNavTab } from '../../context/EmotiContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Bot, 
  Users, 
  Sparkles, 
  User, 
  Smartphone
} from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const { activeTab, setActiveTab, devices } = useEmoti();
  const { userProfile, incomingRequests } = useAuth();

  const isConnected = devices.bot.connected && devices.band.connected;

  const navItems: { id: MainNavTab; label: string; icon: React.ComponentType<any>; badge?: number }[] = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'devices', label: 'Dispositivos', icon: Bot },
    { id: 'circle', label: 'Mi Círculo', icon: Users, badge: incomingRequests.length },
    { id: 'emotiapp', label: 'EmotiApp', icon: Sparkles },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECEDEF] px-2 py-2 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#292A30] font-bold'
                  : 'text-[#7A7E89] hover:text-[#292A30]'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                {item.id === 'devices' && (
                  <span
                    className={`absolute -top-0.5 -right-1 w-2 h-2 rounded-full ${
                      isConnected ? 'bg-emerald-500' : 'bg-amber-400'
                    }`}
                  />
                )}
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 px-1 py-0.2 bg-purple-600 text-white font-bold text-[8px] rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
