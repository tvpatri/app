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
  Palette,
  MailCheck,
  MailWarning,
  KeyRound,
  FileText,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';

export const ProfileView: React.FC = () => {
  const {
    user,
    userProfile,
    updateUserProfile,
    logout,
    resetPassword,
    sendVerificationEmail,
    syncStatus,
    acceptedFriends,
  } = useAuth();

  const { botName, setBotName, currentEmotion, showToast, triggerSparkBurst } = useEmoti();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [displayNameInput, setDisplayNameInput] = useState(userProfile?.displayName || '');
  const [usernameInput, setUsernameInput] = useState(userProfile?.username || '');
  const [bioInput, setBioInput] = useState(userProfile?.bio || '');
  const [botNameInput, setBotNameInput] = useState(userProfile?.botName || botName);
  const [moodVisibility, setMoodVisibility] = useState<MoodVisibility>(
    userProfile?.moodVisibility || 'friends'
  );
  const [avatarBgInput, setAvatarBgInput] = useState(userProfile?.avatarBg || '#FFD65A');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSendingVerify, setIsSendingVerify] = useState(false);

  const currentMeta = EMOTIONS_CONFIG[currentEmotion];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    setFormError('');
    setIsSaving(true);
    try {
      const cleanUsername = usernameInput.trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_]/g, '');
      if (cleanUsername.length < 3) {
        setFormError('El nombre de usuario debe tener al menos 3 caracteres.');
        setIsSaving(false);
        return;
      }

      await updateUserProfile({
        displayName: displayNameInput.trim(),
        username: cleanUsername,
        bio: bioInput.trim(),
        botName: botNameInput.trim() || 'Milo',
        moodVisibility,
        avatarBg: avatarBgInput,
        avatarInitials: displayNameInput.trim().slice(0, 2).toUpperCase(),
      });
      setBotName(botNameInput.trim() || 'Milo');
      setIsEditing(false);
      triggerSparkBurst();
      showToast('Perfil actualizado en Cloud Firestore.', 'success');
    } catch (err: any) {
      setFormError(err.message || 'Error al guardar los cambios en Firestore.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendVerification = async () => {
    setIsSendingVerify(true);
    try {
      await sendVerificationEmail();
      showToast('Correo de verificación enviado a tu bandeja.', 'success');
    } catch (err: any) {
      showToast('No se pudo enviar el correo de verificación.', 'info');
    } finally {
      setIsSendingVerify(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    try {
      await resetPassword(user.email);
      showToast('Enlace de restablecimiento enviado a tu correo.', 'success');
    } catch {
      showToast('Error al enviar solicitud de restablecimiento.', 'info');
    }
  };

  const avatarColorOptions = ['#FFD65A', '#72D6B1', '#FF936F', '#79B9F2', '#B69AF5', '#FF80B5'];

  return (
    <div className="space-y-6 pb-24 animate-pop-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-black text-[#58399E] bg-[#B69AF5]/25 border border-[#B69AF5]/40 px-3 py-1 rounded-xl shadow-xs">
            Cuenta de Usuario Real
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#28243A] tracking-tight mt-1.5 flex items-center gap-2">
            <span>Mi Perfil EMOTI</span>
            <span className="text-2xl animate-bounce">✨</span>
          </h1>
        </div>

        {user ? (
          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border-2 border-[#FFD65A]/50 hover:bg-rose-50 hover:text-rose-600 text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión</span>
          </button>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD65A] via-[#FF936F] to-[#FF80B5] text-[#28243A] text-xs font-black shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Iniciar sesión</span>
          </button>
        )}
      </div>

      {/* Main Profile Hero Card */}
      <div className="bg-white rounded-3xl p-6 border-2 border-[#FFD65A]/50 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center font-black text-2xl shadow-md border-3 border-white shrink-0"
              style={{ backgroundColor: userProfile?.avatarBg || '#FFD65A', color: '#28243A' }}
            >
              {userProfile?.avatarInitials || (userProfile?.displayName || 'EM').slice(0, 2).toUpperCase()}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black text-[#28243A]">
                  {userProfile?.displayName || user?.displayName || 'Usuario EMOTI'}
                </h2>
                {userProfile?.username && (
                  <span className="text-xs font-mono font-bold text-[#FF936F] bg-[#FF936F]/15 px-2.5 py-0.5 rounded-full border border-[#FF936F]/30">
                    @{userProfile.username}
                  </span>
                )}
              </div>

              {userProfile?.bio && (
                <p className="text-xs text-[#28243A]/80 italic font-medium">
                  "{userProfile.bio}"
                </p>
              )}

              <p className="text-xs font-sans text-[#28243A]/70 flex items-center gap-2 flex-wrap pt-0.5">
                <span>Correo: <strong>{user?.email || userProfile?.email || 'No registrado'}</strong></span>
                <span>·</span>
                <span>Emoti-Bot: <strong>{userProfile?.botName || botName}</strong></span>
              </p>

              <div className="pt-1 flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-black bg-[#FFF9F0] border border-[#FFD65A]/50 text-[#28243A]">
                  <span>{currentMeta.emoji}</span>
                  <span className="capitalize">{currentMeta.label}</span>
                </span>
                <span className="text-xs font-bold text-[#28243A]/70">
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
                  setBioInput(userProfile?.bio || '');
                  setBotNameInput(userProfile?.botName || botName);
                  setMoodVisibility(userProfile?.moodVisibility || 'friends');
                  setAvatarBgInput(userProfile?.avatarBg || '#FFD65A');
                  setFormError('');
                }
                setIsEditing(!isEditing);
              }}
              className="px-4 py-2 rounded-2xl bg-[#FFF9F0] hover:bg-[#FFF2DE] text-xs font-black text-[#28243A] border-2 border-[#FFD65A]/50 transition-all self-start sm:self-auto hover:scale-103 cursor-pointer"
            >
              {isEditing ? 'Cancelar edición' : 'Editar perfil'}
            </button>
          )}
        </div>

        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="pt-4 border-t-2 border-[#FFD65A]/30 space-y-4">
            {formError && (
              <div className="p-3 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-center gap-2 text-xs text-rose-800 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-black text-[#28243A] block mb-1">
                  Nombre visible
                </label>
                <input
                  type="text"
                  required
                  value={displayNameInput}
                  onChange={(e) => setDisplayNameInput(e.target.value)}
                  className="w-full bg-[#FFF9F0] border-2 border-[#FFD65A]/50 rounded-2xl px-4 py-2.5 text-xs text-[#28243A] font-bold focus:border-[#FF936F] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#28243A] block mb-1">
                  Nombre de usuario (@handle único)
                </label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  className="w-full bg-[#FFF9F0] border-2 border-[#FFD65A]/50 rounded-2xl px-4 py-2.5 text-xs text-[#28243A] font-mono font-bold focus:border-[#FF936F] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#28243A] block mb-1">
                  Nombre de tu Emoti-Bot
                </label>
                <input
                  type="text"
                  required
                  value={botNameInput}
                  onChange={(e) => setBotNameInput(e.target.value)}
                  className="w-full bg-[#FFF9F0] border-2 border-[#FFD65A]/50 rounded-2xl px-4 py-2.5 text-xs text-[#28243A] font-bold focus:border-[#FF936F] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-black text-[#28243A] block mb-1">
                  Biografía personal (opcional)
                </label>
                <input
                  type="text"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Tu frase o bio..."
                  className="w-full bg-[#FFF9F0] border-2 border-[#FFD65A]/50 rounded-2xl px-4 py-2.5 text-xs text-[#28243A] font-medium focus:border-[#FF936F] outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-black text-[#28243A] block mb-1">
                  Color de avatar
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {avatarColorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setAvatarBgInput(c)}
                      className={`w-8 h-8 rounded-xl transition-transform cursor-pointer ${
                        avatarBgInput === c ? 'ring-3 ring-[#28243A] scale-115' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Mood Visibility Setting */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-black text-[#28243A] block">
                Privacidad de tu estado emocional:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMoodVisibility('friends')}
                  className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black border-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    moodVisibility === 'friends'
                      ? 'bg-[#72D6B1]/20 border-[#72D6B1] text-[#1D6E50]'
                      : 'bg-[#FFF9F0] border-[#FFD65A]/40 text-[#28243A]/70'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Visible para amigos de Mi Círculo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMoodVisibility('nobody')}
                  className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black border-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    moodVisibility === 'nobody'
                      ? 'bg-[#FF80B5]/20 border-[#FF80B5] text-[#A31652]'
                      : 'bg-[#FFF9F0] border-[#FFD65A]/40 text-[#28243A]/70'
                  }`}
                >
                  <EyeOff className="w-4 h-4" />
                  <span>Solo para mí (Privado)</span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 bg-gradient-to-r from-[#FFD65A] via-[#FF936F] to-[#FF80B5] text-[#28243A] font-black text-xs rounded-2xl shadow-xs hover:scale-103 active:scale-95 transition-all cursor-pointer"
              >
                {isSaving ? 'Guardando en Firestore...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Account Security & Verification Card */}
      {user && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/50 shadow-sm space-y-4">
          <h3 className="font-black text-base text-[#28243A] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#72D6B1]" />
            <span>Seguridad y Verificación de Cuenta</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* UID */}
            <div className="p-3 bg-[#FFF9F0] rounded-2xl border border-[#FFD65A]/40 space-y-1">
              <span className="font-bold text-[#28243A]/70 block">ID Único de Firebase (UID):</span>
              <span className="font-mono text-[11px] text-[#28243A] break-all">{user.uid}</span>
            </div>

            {/* Creation date */}
            <div className="p-3 bg-[#FFF9F0] rounded-2xl border border-[#FFD65A]/40 space-y-1">
              <span className="font-bold text-[#28243A]/70 block">Fecha de Registro:</span>
              <span className="text-[#28243A] font-bold">
                {userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleString() : 'Recientemente'}
              </span>
            </div>

            {/* Email Verification */}
            <div className="p-3 bg-[#FFF9F0] rounded-2xl border border-[#FFD65A]/40 flex items-center justify-between gap-2 sm:col-span-2">
              <div className="flex items-center gap-2">
                {user.emailVerified ? (
                  <MailCheck className="w-5 h-5 text-[#1D6E50]" />
                ) : (
                  <MailWarning className="w-5 h-5 text-[#FF936F]" />
                )}
                <div>
                  <span className="font-black text-[#28243A] block">
                    {user.emailVerified ? 'Correo electrónico verificado' : 'Correo electrónico pendiente de verificación'}
                  </span>
                  <span className="text-[11px] text-[#28243A]/70">
                    {user.emailVerified
                      ? 'Tu dirección de correo ha sido validada.'
                      : 'Verifica tu cuenta haciendo clic en el enlace enviado a tu correo.'}
                  </span>
                </div>
              </div>
              {!user.emailVerified && (
                <button
                  onClick={handleSendVerification}
                  disabled={isSendingVerify}
                  className="shrink-0 px-3 py-1.5 rounded-xl bg-white border border-[#FFD65A] text-xs font-black text-[#28243A] hover:bg-[#FFF2DE] transition-all cursor-pointer"
                >
                  {isSendingVerify ? 'Enviando...' : 'Reenviar enlace'}
                </button>
              )}
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between border-t border-[#FFD65A]/30">
            <button
              onClick={handleResetPassword}
              className="text-xs font-bold text-[#FF936F] hover:underline flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Solicitar restablecimiento de contraseña</span>
            </button>
          </div>
        </div>
      )}

      {/* Cloud & Hardware Sync Status Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/50 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#72D6B1] animate-pulse" />
            <h3 className="font-black text-base text-[#28243A]">
              Sincronización en Tiempo Real Activa
            </h3>
          </div>
          <span className="text-xs font-black text-[#1D6E50] bg-[#72D6B1]/20 px-3 py-1 rounded-full border border-[#72D6B1]/40">
            Cloud Firestore Conectado
          </span>
        </div>

        <p className="text-xs text-[#28243A]/70 font-medium leading-relaxed">
          Tus emociones, estados de ánimo, respuestas del Emoti-Bot y pulsos de la pulsera Emoti-Band se sincronizan automáticamente en tiempo real entre tus dispositivos con tu cuenta de Firebase.
        </p>
      </div>

      {isAuthModalOpen && (
        <AuthModal onClose={() => setIsAuthModalOpen(false)} />
      )}
    </div>
  );
};
