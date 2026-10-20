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
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'mood', label: 'Mood Tracker', icon: Smile },
    { id: 'friends', label: 'Amigos', icon: Users },
    { id: 'guide', label: 'Guía', icon: MessageSquare },
    { id: 'progress', label: 'Progreso', icon: TrendingUp },
  ] as const;

  return (
    <div className="space-y-5">
      {/* App Internal Sub-Nav Pills */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#ECEDEF] shadow-xs overflow-x-auto">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = emotiAppSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setEmotiAppSubTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#292A30] text-white shadow-xs'
                  : 'text-[#50545E] hover:text-[#292A30] hover:bg-[#F8F7F4]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
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
