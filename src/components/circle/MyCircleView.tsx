import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmoti } from '../../context/EmotiContext';
import { UserProfile, Friend } from '../../types';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';
import { QUICK_SPARK_MESSAGES } from '../../data/mockData';
import { 
  Users, 
  Search, 
  UserPlus, 
  Sparkles, 
  Check, 
  Clock, 
  Lock, 
  Heart, 
  ShieldCheck, 
  X, 
  Send, 
  Trash2, 
  UserCheck, 
  Radio,
  Zap
} from 'lucide-react';
import { 
  searchUsersByUsername, 
  sendFriendRequest, 
  acceptFriendRequest, 
  rejectFriendRequest, 
  removeFriendship 
} from '../../services/firebaseService';

export const MyCircleView: React.FC = () => {
  const { 
    user, 
    userProfile, 
    incomingRequests, 
    acceptedFriends, 
    refreshFriends 
  } = useAuth();
  
  const { 
    friends, 
    sendEnergySpark, 
    sendSupportPulse, 
    showToast,
    triggerSparkBurst 
  } = useEmoti();

  const [activeCircleTab, setActiveCircleTab] = useState<'friends' | 'discover' | 'requests'>('friends');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  // Spark modal state
  const [sparkTargetUser, setSparkTargetUser] = useState<{ id: string; name: string } | null>(null);
  const [selectedMessage, setSelectedMessage] = useState(QUICK_SPARK_MESSAGES[0]);
  const [customMessage, setCustomMessage] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchUsersByUsername(searchQuery, user?.uid);
      setSearchResults(results);
      if (results.length === 0) {
        showToast('No se encontraron usuarios con ese @username.', 'info');
      }
    } catch {
      showToast('Error al buscar usuarios', 'info');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendFriendRequest = async (targetUser: UserProfile) => {
    if (!userProfile) {
      showToast('Inicia sesión para enviar solicitudes de amistad.', 'info');
      return;
    }
    try {
      await sendFriendRequest(userProfile, targetUser);
      setSentRequests((prev) => [...prev, targetUser.id]);
      triggerSparkBurst();
      showToast(`Solicitud enviada a @${targetUser.username}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error al enviar solicitud', 'info');
    }
  };

  const handleAccept = async (req: any) => {
    if (!user) return;
    try {
      await acceptFriendRequest(req, user.uid);
      await refreshFriends();
      triggerSparkBurst();
      showToast(`¡Solicitud aceptada! @${req.fromUsername} ahora está en tu Círculo.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error al aceptar solicitud', 'info');
    }
  };

  const handleReject = async (reqId: string) => {
    try {
      await rejectFriendRequest(reqId);
      showToast('Solicitud rechazada', 'info');
    } catch {}
  };

  const handleSendSparkSubmit = () => {
    if (!sparkTargetUser) return;
    const finalMsg = customMessage.trim() || selectedMessage;
    sendEnergySpark(sparkTargetUser.id, finalMsg, sparkTargetUser.name);
    triggerSparkBurst();
    showToast(`¡Chispa enviada a ${sparkTargetUser.name}! ✨`, 'spark');
    setSparkTargetUser(null);
    setCustomMessage('');
  };

  return (
    <div className="space-y-6 pb-24 animate-pop-in">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-black text-[#A31652] bg-[#FF80B5]/25 border border-[#FF80B5]/40 px-3 py-1 rounded-xl shadow-xs">
          Red Social Consciente
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#28243A] tracking-tight mt-1.5 flex items-center gap-2">
          <span>Mi Círculo de Amigos</span>
          <span className="text-2xl animate-bounce">💖</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#28243A]/70 font-medium mt-1">
          Tu red íntima de amistades para compartir bienestar, energía positiva y soporte mutuo sin invadir.
        </p>
      </div>

      {/* Subtab Segmented Controls with colorful vibrant buttons */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#FFF2DE] rounded-2xl border-2 border-[#FFD65A]/50 shadow-inner">
        <button
          onClick={() => setActiveCircleTab('friends')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all ${
            activeCircleTab === 'friends'
              ? 'bg-gradient-to-r from-[#FF80B5] to-[#FF936F] text-white shadow-xs scale-102'
              : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
          }`}
        >
          Mis amigos ({friends.length})
        </button>
        <button
          onClick={() => setActiveCircleTab('discover')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all ${
            activeCircleTab === 'discover'
              ? 'bg-gradient-to-r from-[#72D6B1] to-[#79B9F2] text-[#28243A] shadow-xs scale-102'
              : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
          }`}
        >
          Descubrir
        </button>
        <button
          onClick={() => setActiveCircleTab('requests')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all relative ${
            activeCircleTab === 'requests'
              ? 'bg-gradient-to-r from-[#B69AF5] to-[#FF80B5] text-white shadow-xs scale-102'
              : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
          }`}
        >
          <span>Solicitudes</span>
          {incomingRequests.length > 0 && (
            <span className="ml-1.5 px-2 py-0.5 bg-[#FF80B5] text-white rounded-full text-[10px] font-black border border-white">
              {incomingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* 1. MY FRIENDS TAB */}
      {activeCircleTab === 'friends' && (
        <div className="space-y-4">
          {/* Privacy Note */}
          <div className="p-4 bg-white rounded-2xl border-2 border-[#72D6B1]/40 flex items-start gap-3 text-xs text-[#28243A] shadow-xs">
            <Lock className="w-4 h-4 text-[#1D6E50] shrink-0 mt-0.5" />
            <span className="font-medium">
              <strong className="text-[#1D6E50] font-black">Visibilidad Emocional Consciente:</strong> Solo ves las emociones de amigos que han configurado compartir su ánimo con su círculo íntimo. No se comparte ninguna información biométrica privada.
            </span>
          </div>

          {/* Friends List with vibrant cards */}
          <div className="space-y-3.5">
            {friends.map((friend) => {
              const moodMeta = friend.sharedMood ? EMOTIONS_CONFIG[friend.sharedMood] : null;

              return (
                <div
                  key={friend.id}
                  className="bg-white rounded-3xl p-5 border-2 border-[#FFD65A]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#FF936F] transition-all hover:shadow-md group"
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <div
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center font-black text-base sm:text-lg shadow-sm border-2 border-white transition-transform group-hover:scale-105"
                        style={{ backgroundColor: friend.avatarBg, color: friend.avatarColor }}
                      >
                        {friend.avatarInitials}
                      </div>
                      {friend.isOnline && (
                        <span
                          className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#72D6B1] border-2 border-white shadow-xs animate-pulse"
                          title="En línea"
                        />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-[#28243A]">
                          {friend.name}
                        </h3>
                        {friend.username && (
                          <span className="text-xs font-mono font-bold text-[#FF936F]">
                            @{friend.username}
                          </span>
                        )}
                      </div>

                      {/* Shared Mood Display */}
                      {moodMeta && friend.moodVisibility !== 'nobody' ? (
                        <div className="flex items-center gap-2 text-xs font-bold text-[#28243A]">
                          <span>Estado actual:</span>
                          <span 
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-xl border font-black capitalize"
                            style={{ backgroundColor: `${moodMeta.accentHex}30`, borderColor: moodMeta.accentHex, color: moodMeta.colorText }}
                          >
                            <span>{moodMeta.emoji}</span>
                            <span>{moodMeta.label}</span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-xs text-[#28243A]/50 italic">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Estado privado</span>
                        </div>
                      )}

                      <p className="text-xs text-[#28243A]/70 italic font-medium">
                        "{friend.statusQuote}"
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-0 border-[#FFD65A]/20">
                    <button
                      onClick={() =>
                        setSparkTargetUser({ id: friend.id, name: friend.name })
                      }
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD65A] via-[#FF936F] to-[#FF80B5] hover:scale-105 text-[#28243A] text-xs font-black shadow-[0_4px_12px_rgba(255,147,111,0.35)] transition-all active:scale-95 border border-white"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-[#28243A]" />
                      <span>Chispa ✨</span>
                    </button>

                    <button
                      onClick={() => {
                        sendSupportPulse(friend.name, friend.id);
                        triggerSparkBurst();
                      }}
                      className="p-2.5 rounded-2xl bg-[#FF80B5]/20 hover:bg-[#FF80B5]/30 text-[#A31652] border border-[#FF80B5]/40 transition-all hover:scale-105 active:scale-95"
                      title="Enviar pulso sensorial de apoyo"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. DISCOVER TAB */}
      {activeCircleTab === 'discover' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/50 shadow-sm space-y-4">
          <div>
            <h3 className="font-black text-base text-[#28243A] flex items-center gap-2">
              <Search className="w-4 h-4 text-[#79B9F2]" />
              <span>Buscar amigos por @username</span>
            </h3>
            <p className="text-xs text-[#28243A]/70 font-medium mt-0.5">
              Encuentra a tus amigos que usen EMOTI para conectar y enviarse apoyo emocional.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#28243A]/40 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ej. sofia, mateo, alex, valentina..."
                className="w-full bg-[#FFF9F0] border-2 border-[#FFD65A]/50 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#28243A] font-medium focus:border-[#FF936F] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] text-xs font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xs disabled:opacity-50"
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {/* Search Results */}
          <div className="space-y-3 pt-2">
            {searchResults.length > 0 ? (
              searchResults.map((target) => {
                const isSent = sentRequests.includes(target.id);
                const isAlreadyFriend = friends.some(
                  (f) => f.username?.toLowerCase() === target.username?.toLowerCase()
                );

                return (
                  <div
                    key={target.id}
                    className="p-4 rounded-2xl bg-[#FFF9F0] border-2 border-[#FFD65A]/40 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xs shadow-xs border border-white"
                        style={{ backgroundColor: target.avatarBg || '#FFD65A', color: '#28243A' }}
                      >
                        {target.avatarInitials || target.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-black text-xs text-[#28243A]">
                          {target.displayName}
                        </h4>
                        <p className="text-[11px] font-mono font-bold text-[#FF936F]">
                          @{target.username}
                        </p>
                      </div>
                    </div>

                    {isAlreadyFriend ? (
                      <span className="flex items-center gap-1 text-xs font-black text-[#1D6E50] bg-[#72D6B1]/20 px-3 py-1.5 rounded-xl border border-[#72D6B1]/40">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Amigos</span>
                      </span>
                    ) : isSent ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-[#28243A] bg-white px-3 py-1.5 rounded-xl border border-[#FFD65A]/50">
                        <Clock className="w-3.5 h-3.5 text-[#FF936F]" />
                        <span>Solicitud enviada</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendFriendRequest(target)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Agregar</span>
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-[#28243A]/70 space-y-1">
                <p>Prueba buscar compañeros demo activos en la red:</p>
                <div className="flex justify-center gap-2 pt-2">
                  {['sofia', 'mateo', 'valentina', 'diego'].map((demoName) => (
                    <button
                      key={demoName}
                      onClick={() => setSearchQuery(demoName)}
                      className="px-2.5 py-1 rounded-xl bg-[#FFF9F0] border border-[#FFD65A]/50 text-xs font-mono font-bold text-[#A03E15] hover:bg-[#FFD65A]/30 transition-colors"
                    >
                      @{demoName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. REQUESTS TAB */}
      {activeCircleTab === 'requests' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-[#28243A]">
              Solicitudes de amistad recibidas
            </h3>
            <span className="text-xs font-bold text-[#FF80B5]">
              {incomingRequests.length} pendientes
            </span>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#28243A]/70 space-y-2">
              <Users className="w-10 h-10 mx-auto text-[#FFD65A] animate-bounce" />
              <p className="font-bold">No tienes solicitudes pendientes en este momento.</p>
              <p className="text-[11px]">Cuando alguien te envíe una solicitud por tu @username, podrás aceptarla aquí.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-[#FFF9F0] border-2 border-[#B69AF5]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-2 border-white shadow-xs"
                      style={{ backgroundColor: req.fromAvatarBg || '#FFD65A', color: '#28243A' }}
                    >
                      {req.fromAvatarInitials}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#28243A]">
                        {req.fromDisplayName}
                      </h4>
                      <p className="text-xs font-mono font-bold text-[#FF936F]">
                        @{req.fromUsername}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAccept(req)}
                      className="flex-1 sm:flex-none py-2 px-5 bg-gradient-to-r from-[#72D6B1] to-[#79B9F2] text-[#28243A] text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xs"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="py-2 px-4 bg-white text-[#28243A] hover:bg-[#FFF2DE] text-xs font-bold rounded-xl border border-[#28243A]/10 transition-all"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Energy Spark Modal */}
      {sparkTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#28243A]/60 backdrop-blur-xs">
          <div className="bg-[#FFF9F0] rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#FFD65A] relative space-y-4 animate-pop-in">
            <button
              onClick={() => setSparkTargetUser(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-[#28243A] hover:bg-[#FFD65A]/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-black text-base text-[#28243A] flex items-center gap-2">
                <span>Enviar Chispa a {sparkTargetUser.name}</span>
                <span>✨</span>
              </h3>
              <p className="text-xs text-[#28243A]/70 font-medium mt-0.5">
                Aparecerá en sus notificaciones y en su ecosistema en tiempo real.
              </p>
            </div>

            <div className="space-y-2">
              {QUICK_SPARK_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedMessage(msg);
                    setCustomMessage('');
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all border-2 ${
                    selectedMessage === msg && !customMessage
                      ? 'bg-[#FFD65A]/30 border-[#FF936F] text-[#28243A] shadow-xs'
                      : 'bg-white border-[#FFD65A]/40 text-[#28243A]/80 hover:border-[#FFD65A]'
                  }`}
                >
                  "{msg}"
                </button>
              ))}
            </div>

            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="O escribe un mensaje personalizado..."
              className="w-full bg-white border-2 border-[#FFD65A]/50 rounded-2xl px-4 py-2.5 text-xs text-[#28243A] font-medium focus:border-[#FF936F] outline-none"
            />

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setSparkTargetUser(null)}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-[#28243A] hover:bg-[#FFF2DE]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendSparkSubmit}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD65A] via-[#FF936F] to-[#FF80B5] text-[#28243A] text-xs font-black shadow-[0_4px_12px_rgba(255,147,111,0.35)] flex items-center gap-1.5 hover:scale-103 active:scale-95 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 fill-[#28243A]" />
                <span>Enviar Chispa ✨</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
