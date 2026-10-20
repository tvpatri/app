import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmoti } from '../../context/EmotiContext';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';
import { MoodVisibility } from '../../types';
import { 
  User, 
  Bot, 
  Settings, 
  LogOut, 
  LogIn, 
  Sparkles, 
  Smartphone, 
  Check, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Radio, 
  RefreshCw,
  AtSign,
  Palette
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';

export const ProfileView: React.FC = () => {
  const { user, userProfile, updateUserProfile, logout, syncStatus, acceptedFriends } = useAuth();
  const { botName, setBotName, currentEmotion, showToast } = useEmoti();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [displayNameInput, setDisplayNameInput] = useState(userProfile?.displayName || 'Alex');
  const [usernameInput, setUsernameInput] = useState(userProfile?.username || 'alexm');
  const [botNameInput, setBotNameInput] = useState(userProfile?.botName || botName);
  const [moodVisibility, setMoodVisibility] = useState<MoodVisibility>(
    userProfile?.moodVisibility || 'friends'
  );
  const [avatarBgInput, setAvatarBgInput] = useState(userProfile?.avatarBg || '#DCD5F5');
  const [isSaving, setIsSaving] = useState(false);

  const currentMeta = EMOTIONS_CONFIG[currentEmotion];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    setIsSaving(true);
    try {
      const cleanUsername = usernameInput.trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_]/g, '');
      await updateUserProfile({
        displayName: displayNameInput.trim(),
        username: cleanUsername,
        botName: botNameInput.trim() || 'Milo',
        moodVisibility,
        avatarBg: avatarBgInput,
        avatarInitials: displayNameInput.slice(0, 2).toUpperCase(),
      });
      setBotName(botNameInput.trim() || 'Milo');
      setIsEditing(false);
      showToast('Perfil y preferencias sincronizados en la nube.', 'success');
    } catch {
      showToast('Error al guardar perfil.', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  const avatarColorOptions = ['#DCD5F5', '#F5DFD3', '#D9E8DE', '#DCEAF4', '#FDE68A', '#E2E8F0'];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#4F4275] bg-[#DCD5F5]/60 px-2 py-0.5 rounded-md">
            Cuenta & Sincronización
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292A30] tracking-tight mt-1">
            Mi Perfil
          </h1>
        </div>

        {user ? (
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D6D8DC] hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold transition-all shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión</span>
          </button>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#292A30] text-white hover:bg-black text-xs font-semibold shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Iniciar sesión</span>
          </button>
        )}
      </div>

      {/* Main Profile Hero Card */}
      <div className="bg-white rounded-3xl p-6 border border-[#ECEDEF] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-md border-2 border-white"
              style={{ backgroundColor: userProfile?.avatarBg || '#DCD5F5', color: '#292A30' }}
            >
              {userProfile?.avatarInitials || (userProfile?.displayName || 'AL').slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-0.5">
              <h2 className="text-xl font-bold text-[#292A30]">
                {userProfile?.displayName || 'Alex Morales'}
              </h2>
              <p className="text-xs font-mono text-[#7A7E89] flex items-center gap-1">
                <span>@{userProfile?.username || 'alexm'}</span>
                <span>·</span>
                <span className="text-[#50545E]">Emoti-Bot: <strong>{userProfile?.botName || botName}</strong></span>
              </p>
              <div className="pt-1 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F8F7F4] border border-[#ECEDEF] text-[#292A30]">
                  <span>{currentMeta.emoji}</span>
                  <span className="capitalize">{currentMeta.label}</span>
                </span>
                <span className="text-xs text-[#7A7E89]">
                  {acceptedFriends.length} {acceptedFriends.length === 1 ? 'amigo' : 'amigos'} en Mi Círculo
                </span>
              </div>
            </div>
          </div>

          {user && (
            <button
              onClick={() => {
                if (!isEditing) {
                  setDisplayNameInput(userProfile?.displayName || '');
                  setUsernameInput(userProfile?.username || '');
                  setBotNameInput(userProfile?.botName || botName);
                  setMoodVisibility(userProfile?.moodVisibility || 'friends');
                  setAvatarBgInput(userProfile?.avatarBg || '#DCD5F5');
                }
                setIsEditing(!isEditing);
              }}
              className="px-4 py-2 rounded-xl bg-[#F8F7F4] hover:bg-[#ECEDEF] text-xs font-semibold text-[#292A30] border border-[#D6D8DC] transition-all self-start sm:self-auto"
            >
              {isEditing ? 'Cancelar edición' : 'Editar perfil'}
            </button>
          )}
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-4 border-t border-[#ECEDEF] space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#50545E] block mb-1">
                  Nombre visible
                </label>
                <input
                  type="text"
                  required
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  className="w-full bg-[#F8F7F4] border border-[#D6D8DC] rounded-xl px-3 py-2 text-xs text-[#292A30] focus:ring-2 focus:ring-[#DCD5F5] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#50545E] block mb-1">
                  Nombre de usuario (@handle)
                </label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-[#F8F7F4] border border-[#D6D8DC] rounded-xl px-3 py-2 text-xs text-[#292A30] focus:ring-2 focus:ring-[#DCD5F5] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#50545E] block mb-1">
                  Nombre de tu Emoti-Bot
                </label>
                <input
                  type="text"
                  required
                  value={botNameInput}
                  onChange={(e) => setBotNameInput(e.target.value)}
                  className="w-full bg-[#F8F7F4] border border-[#D6D8DC] rounded-xl px-3 py-2 text-xs text-[#292A30] focus:ring-2 focus:ring-[#DCD5F5] outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#50545E] block mb-1">
                  Color de avatar
                </label>
                <div className="flex items-center gap-2 pt-0.5">
                  {avatarColorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAvatarBgInput(c)}
                      className={`w-7 h-7 rounded-lg transition-transform ${
                        avatarBgInput === c ? 'ring-2 ring-[#292A30] scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Mood Visibility Setting */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-semibold text-[#50545E] block">
                Privacidad de tu estado de ánimo:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMoodVisibility('friends')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    moodVisibility === 'friends'
                      ? 'bg-[#DCD5F5]/30 border-[#4F4275] ring-1 ring-[#4F4275]'
                      : 'bg-[#F8F7F4] border-[#ECEDEF] text-[#50545E]'
                  }`}
                >
                  <Eye className="w-4 h-4 text-[#4F4275] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-[#292A30] block">Solo amigos</span>
                    <span className="text-[10px] text-[#50545E]">Tus amigos confirmados verán tu ánimo actual en Mi Círculo.</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setMoodVisibility('nobody')}
                  className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                    moodVisibility === 'nobody'
                      ? 'bg-[#DCD5F5]/30 border-[#4F4275] ring-1 ring-[#4F4275]'
                      : 'bg-[#F8F7F4] border-[#ECEDEF] text-[#50545E]'
                  }`}
                >
                  <EyeOff className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-[#292A30] block">Nadie (Privado)</span>
                    <span className="text-[10px] text-[#50545E]">Tu emoción se mantendrá 100% privada en tus dispositivos.</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-semibold text-[#50545E] hover:bg-[#ECEDEF] rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-5 py-2 bg-[#292A30] hover:bg-black text-white text-xs font-semibold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Guardar cambios</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* REAL-TIME MULTI-DEVICE SYNCHRONIZATION STATUS CARD */}
      <div className="bg-white rounded-3xl p-6 border border-[#ECEDEF] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#292A30]">
                Sincronización multi-dispositivo en tiempo real
              </h3>
              <p className="text-xs text-[#50545E]">
                Cloud Firestore & Firebase Auth activados
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>
              {syncStatus === 'synced' ? 'Sincronizado' : syncStatus === 'syncing' ? 'Sincronizando...' : 'Sin conexión'}
            </span>
          </div>
        </div>

        <div className="p-4 bg-[#F8F7F4] rounded-2xl border border-[#ECEDEF] text-xs text-[#50545E] space-y-2.5 leading-relaxed">
          <p>
            Esta cuenta está sincronizada con <strong>Cloud Firestore</strong> mediante suscripciones en vivo (<code>onSnapshot</code>).
          </p>
          <div className="bg-white p-3 rounded-xl border border-[#ECEDEF] space-y-2 text-[11px]">
            <div className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <span>
                <strong>Prueba el caso multi-dispositivo:</strong> Abre esta misma aplicación en otro teléfono o pestaña con la misma cuenta. Activa el Emoti-Bot a pantalla completa en la primera pantalla y cambia tu emoción en la segunda: el robot cambiará su color y rostro automáticamente sin salir del modo inmersivo.
              </span>
            </div>
          </div>
          <p className="text-[11px] text-[#7A7E89]">
            Los campos sincronizados incluyen: estado de ánimo actual, carita del robot, color de fondo, nombre del Emoti-Bot y pulsera Emoti-Band.
          </p>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
