import React, { useState } from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Bluetooth, 
  Smartphone, 
  Columns2, 
  HeartHandshake, 
  Check, 
  X,
  Bell,
  Radio,
  User as UserIcon,
  LogIn,
  RotateCw
} from 'lucide-react';
import { NotificationCenter } from '../notifications/NotificationCenter';
import { AuthModal } from '../auth/AuthModal';

export const Header: React.FC = () => {
  const { 
    devices, 
    viewMode, 
    setViewMode, 
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
      <header className="sticky top-0 z-40 bg-[#F8F7F4]/90 backdrop-blur-md border-b border-[#ECEDEF] px-3 sm:px-6 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setActiveTab('home')}
              className="cursor-pointer group flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl bg-[#292A30] text-[#F8F7F4] flex items-center justify-center font-bold text-sm tracking-wider shadow-sm transition-transform group-hover:scale-105">
                E
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-[#292A30]">EMOTI</span>
                  <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#DCD5F5]/60 text-[#4F4275]">
                    Connected
                  </span>
                </div>
                <p className="text-[11px] text-[#50545E] hidden lg:block -mt-0.5">
                  Feel connected. Stay supported.
                </p>
              </div>
            </div>
          </div>

          {/* Center Navigation on Desktop */}
          <nav className="hidden md:flex items-center bg-[#ECEDEF]/80 p-1 rounded-2xl gap-0.5">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'home'
                  ? 'bg-white text-[#292A30] shadow-xs'
                  : 'text-[#50545E] hover:text-[#292A30]'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => setActiveTab('devices')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'devices'
                  ? 'bg-white text-[#292A30] shadow-xs'
                  : 'text-[#50545E] hover:text-[#292A30]'
              }`}
            >
              Dispositivos
            </button>
            <button
              onClick={() => setActiveTab('circle')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'circle'
                  ? 'bg-white text-[#292A30] shadow-xs'
                  : 'text-[#50545E] hover:text-[#292A30]'
              }`}
            >
              Mi Círculo
            </button>
            <button
              onClick={() => setActiveTab('emotiapp')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'emotiapp'
                  ? 'bg-white text-[#292A30] shadow-xs'
                  : 'text-[#50545E] hover:text-[#292A30]'
              }`}
            >
              EmotiApp
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                activeTab === 'profile'
                  ? 'bg-white text-[#292A30] shadow-xs'
                  : 'text-[#50545E] hover:text-[#292A30]'
              }`}
            >
              Perfil
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Real-time Multi-device Sync Status Indicator */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                syncStatus === 'synced'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
              title="Sincronización multi-dispositivo en tiempo real con Cloud Firestore"
            >
              <Radio className={`w-3 h-3 ${syncStatus === 'synced' ? 'text-emerald-600 animate-pulse' : ''}`} />
              <span>
                {syncStatus === 'synced'
                  ? 'Sincronizado'
                  : syncStatus === 'syncing'
                  ? 'Sincronizando...'
                  : 'Sin conexión'}
              </span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifs(true)}
              className="relative p-2 rounded-xl bg-white border border-[#D6D8DC] hover:bg-[#F8F7F4] text-[#292A30] transition-colors"
              title="Centro de notificaciones"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-purple-600 text-white font-bold text-[9px] flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            {user && userProfile ? (
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl bg-white border border-[#D6D8DC] hover:border-[#4F4275] transition-all shadow-xs"
                title="Ver mi perfil"
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px]"
                  style={{ backgroundColor: userProfile.avatarBg || '#DCD5F5', color: '#292A30' }}
                >
                  {userProfile.avatarInitials}
                </div>
                <span className="text-xs font-semibold text-[#292A30] hidden sm:inline max-w-[80px] truncate">
                  {userProfile.displayName}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#292A30] text-white hover:bg-black text-xs font-semibold shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cuenta</span>
              </button>
            )}

            {/* SDG 3 Info Trigger */}
            <button
              onClick={() => setShowSdgModal(true)}
              className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/80 transition-colors"
              title="ODS 3: Salud y Bienestar"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-700" />
            </button>

            {/* Showroom split toggle on desktop */}
            <div className="hidden xl:flex items-center bg-[#ECEDEF] p-0.5 rounded-lg border border-[#D6D8DC]">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-1.5 rounded text-xs transition-all ${
                  viewMode === 'mobile' ? 'bg-white shadow-xs text-[#292A30]' : 'text-[#7A7E89] hover:text-[#292A30]'
                }`}
                title="Vista Smartphone Individual"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded text-xs transition-all ${
                  viewMode === 'split' ? 'bg-white shadow-xs text-[#292A30]' : 'text-[#7A7E89] hover:text-[#292A30]'
                }`}
                title="Vista Dividida Showroom"
              >
                <Columns2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifs}
        onClose={() => setShowNotifs(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* UN SDG 3 Modal */}
      {showSdgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-[#ECEDEF] relative">
            <button
              onClick={() => setShowSdgModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#50545E] hover:bg-[#ECEDEF] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="font-bold text-base text-[#292A30]">ODS 3: Salud y Bienestar</h3>
                <p className="text-xs text-[#50545E]">Meta 3.4 · Salud mental y bienestar emocional</p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-[#50545E]">
              <p>
                El ecosistema <strong>EMOTI</strong> promueve la salud mental positiva, el acompañamiento preventivo del aislamiento social y la construcción de amistades afectivas basadas en la empatía.
              </p>
              <div className="bg-[#F8F7F4] p-3 rounded-2xl space-y-2 border border-[#ECEDEF]">
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Multi-Dispositivo:</strong> Abre tu cuenta en varios dispositivos y tu Emoti-Bot responderá al instante.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Mi Círculo:</strong> Conexión con amigos reales mediante @username para apoyo recíproco.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                  <span><strong>Pulsos & Chispas:</strong> Señales no invasivas de afecto y presencia.</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowSdgModal(false)}
                className="px-4 py-2 bg-[#292A30] text-white text-xs font-semibold rounded-xl hover:bg-[#1a1b1f] transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
