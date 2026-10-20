import React, { useState } from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { useAuth } from '../../context/AuthContext';
import { 
  HeartHandshake, 
  X,
  Bell,
  Radio,
  User as UserIcon,
  LogIn,
  Sparkles,
  Bot,
  Watch
} from 'lucide-react';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { AuthModal } from '../auth/AuthModal';

export const Header: React.FC = () => {
  const { 
    devices, 
    activeTab, 
    setActiveTab,
  } = useEmoti();

  const { user, userProfile, syncStatus, unreadCount } = useAuth();
  
  const [showSdgModal, setShowSdgModal] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const connectedCount = (devices.bot.connected ? 1 : 0) + (devices.band.connected ? 1 : 0);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FFF9F0]/90 backdrop-blur-md border-b border-[#FFD65A]/30 px-3 sm:px-6 py-3 shadow-[0_2px_15px_-3px_rgba(255,214,90,0.15)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand with vibrant colorful badge */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('home')}
              className="cursor-pointer group flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF936F] via-[#FFD65A] to-[#B69AF5] text-[#28243A] flex items-center justify-center font-black text-lg tracking-wider shadow-[0_4px_12px_rgba(255,147,111,0.35)] transition-all group-hover:scale-105 group-hover:rotate-3">
                <span className="drop-shadow-xs">E</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-[#28243A]">EMOTI</span>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#FF80B5]/20 text-[#A31652] border border-[#FF80B5]/40 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    Ecosystem
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[#FF936F] hidden sm:block -mt-0.5">
                  Conexión · Amistad · Bienestar
                </p>
              </div>
            </button>
          </div>

          {/* Center Navigation on Desktop with colorful active pills */}
          <nav className="hidden md:flex items-center bg-[#FFF2DE] p-1.5 rounded-2xl gap-1 border border-[#FFD65A]/40 shadow-inner">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'home'
                  ? 'bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] shadow-sm scale-102'
                  : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setActiveTab('devices')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'devices'
                  ? 'bg-gradient-to-r from-[#79B9F2] to-[#B69AF5] text-white shadow-sm scale-102'
                  : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
              }`}
            >
              Dispositivos
            </button>
            <button
              onClick={() => setActiveTab('circle')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'circle'
                  ? 'bg-gradient-to-r from-[#FF80B5] to-[#FF936F] text-white shadow-sm scale-102'
                  : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
              }`}
            >
              Mi Círculo
            </button>
            <button
              onClick={() => setActiveTab('emotiapp')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'emotiapp'
                  ? 'bg-gradient-to-r from-[#72D6B1] to-[#79B9F2] text-[#28243A] shadow-sm scale-102'
                  : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
              }`}
            >
              EmotiApp
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all duration-200 ${
                activeTab === 'profile'
                  ? 'bg-gradient-to-r from-[#B69AF5] to-[#FF80B5] text-white shadow-sm scale-102'
                  : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
              }`}
            >
              Perfil
            </button>
          </nav>

          {/* Right actions: Hardware sync + Notifications + User Profile */}
          <div className="flex items-center gap-2.5">
            {/* Real-time Multi-device Sync Status Indicator */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                syncStatus === 'synced'
                  ? 'bg-[#72D6B1]/20 text-[#1D6E50] border-[#72D6B1]'
                  : syncStatus === 'syncing'
                  ? 'bg-[#FFD65A]/25 text-[#946200] border-[#FFD65A]'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
              title="Sincronización multi-dispositivo en tiempo real con Cloud Firestore"
            >
              <Radio className={`w-3.5 h-3.5 ${syncStatus === 'synced' ? 'text-[#1D6E50] animate-pulse' : ''}`} />
              <span>
                {syncStatus === 'synced'
                  ? 'Sincronizado'
                  : syncStatus === 'syncing'
                  ? 'Sincronizando...'
                  : 'Sin conexión'}
              </span>
            </div>

            {/* Hardware devices badge */}
            <button
              onClick={() => setActiveTab('devices')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white border border-[#FFD65A]/40 hover:border-[#FF936F] shadow-xs text-xs font-bold text-[#28243A] transition-all hover:scale-103"
              title="Dispositivos vinculados"
            >
              <span className="w-2 h-2 rounded-full bg-[#72D6B1] animate-ping" />
              <div className="flex items-center gap-1">
                <Bot className="w-3.5 h-3.5 text-[#B69AF5]" />
                <Watch className="w-3.5 h-3.5 text-[#79B9F2]" />
                <span className="text-[11px] font-extrabold">{connectedCount}/2</span>
              </div>
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifs(!showNotifs)}
              className="relative p-2 rounded-2xl bg-white border border-[#FFD65A]/40 hover:bg-[#FFF2DE] text-[#28243A] transition-all hover:scale-105 shadow-xs"
              title="Notificaciones de bienestar y amigos"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF80B5] text-white text-[9px] font-black flex items-center justify-center animate-bounce shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile / Login Avatar */}
            {user ? (
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 p-1 pr-2.5 rounded-2xl bg-white border border-[#FFD65A]/40 hover:border-[#FF936F] shadow-xs transition-all hover:scale-103"
              >
                <div 
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-xs"
                  style={{ 
                    backgroundColor: userProfile?.avatarBg || '#FFD65A', 
                    color: '#28243A' 
                  }}
                >
                  {userProfile?.avatarInitials || 'EU'}
                </div>
                <span className="text-xs font-bold text-[#28243A] hidden lg:inline max-w-[90px] truncate">
                  {userProfile?.displayName || user.displayName || 'Mi Perfil'}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-[#FF936F] to-[#FF80B5] text-white text-xs font-bold shadow-[0_4px_12px_rgba(255,147,111,0.3)] transition-all hover:scale-105 active:scale-95"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Ingresar</span>
              </button>
            )}

            {/* SDG 3 Impact Badge */}
            <button
              onClick={() => setShowSdgModal(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-2xl bg-[#72D6B1]/20 text-[#1D6E50] border border-[#72D6B1]/40 text-[11px] font-bold hover:bg-[#72D6B1]/30 transition-all"
            >
              <HeartHandshake className="w-3.5 h-3.5 text-[#1D6E50]" />
              <span>ODS 3</span>
            </button>
          </div>
        </div>
      </header>

      {/* Notifications Drawer */}
      {showNotifs && (
        <NotificationCenter onClose={() => setShowNotifs(false)} />
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* SDG 3 Modal */}
      {showSdgModal && (
        <div className="fixed inset-0 z-50 bg-[#28243A]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFF9F0] border-2 border-[#72D6B1] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-pop-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#72D6B1] text-[#1D6E50] flex items-center justify-center font-black">
                  3
                </div>
                <h3 className="font-extrabold text-base text-[#28243A]">ODS 3: Salud y Bienestar</h3>
              </div>
              <button
                onClick={() => setShowSdgModal(false)}
                className="p-1 rounded-xl hover:bg-[#FFD65A]/30 text-[#28243A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#28243A]/80 leading-relaxed font-medium">
              EMOTI promueve la salud emocional, el autoconocimiento preventivo y el apoyo mutuo entre amistades, alineándose directamente con la Meta 3.4 de la ONU para el bienestar de la juventud.
            </p>
            <div className="p-3 bg-white rounded-2xl border border-[#72D6B1]/50 text-xs text-[#1D6E50] font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Tecnología empática para una juventud conectada y saludable</span>
            </div>
            <button
              onClick={() => setShowSdgModal(false)}
              className="w-full py-2.5 rounded-2xl bg-[#28243A] text-white text-xs font-bold hover:bg-black transition-colors"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
