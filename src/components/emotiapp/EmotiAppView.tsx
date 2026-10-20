import React from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { HomeDashboard } from './HomeDashboard';
import { MoodTracker } from './MoodTracker';
import { FriendsNetwork } from './FriendsNetwork';
import { TalkTogether } from './TalkTogether';
import { MyProgress } from './MyProgress';
import { 
  Home, 
  Smile, 
  Users, 
  MessageSquare, 
  TrendingUp 
} from 'lucide-react';

export const EmotiAppView: React.FC = () => {
  const { emotiAppSubTab, setEmotiAppSubTab } = useEmoti();

  const subTabs = [
    { id: 'home', label: 'Inicio', icon: Home, gradient: 'from-[#FFD65A] to-[#FF936F]' },
    { id: 'mood', label: 'Mood Tracker', icon: Smile, gradient: 'from-[#72D6B1] to-[#79B9F2]' },
    { id: 'friends', label: 'Amigos', icon: Users, gradient: 'from-[#FF80B5] to-[#FF936F]' },
    { id: 'guide', label: 'Guía Diálogo', icon: MessageSquare, gradient: 'from-[#B69AF5] to-[#79B9F2]' },
    { id: 'progress', label: 'Progreso', icon: TrendingUp, gradient: 'from-[#FF936F] to-[#FF80B5]' },
  ] as const;

  return (
    <div className="space-y-5 animate-pop-in">
      {/* App Internal Sub-Nav Pills with colorful gradients */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#FFF2DE] rounded-2xl border-2 border-[#FFD65A]/50 shadow-inner overflow-x-auto">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = emotiAppSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setEmotiAppSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                isActive
                  ? `bg-gradient-to-r ${tab.gradient} text-[#28243A] shadow-xs scale-102`
                  : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-View */}
      {emotiAppSubTab === 'home' && <HomeDashboard />}
      {emotiAppSubTab === 'mood' && <MoodTracker />}
      {emotiAppSubTab === 'friends' && <FriendsNetwork />}
      {emotiAppSubTab === 'guide' && <TalkTogether />}
      {emotiAppSubTab === 'progress' && <MyProgress />}
    </div>
  );
};
