import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmoti } from '../../context/EmotiContext';
import { UserProfile, Friend, EnergySparkEvent } from '../../types';
import { EMOTIONS_CONFIG } from '../../data/emotionsData';
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
  Zap,
  Ban,
  ShieldAlert,
  Info,
  Calendar,
  Bot,
  UserX,
} from 'lucide-react';
import {
  searchUsersByUsername,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriendship,
} from '../../services/firebaseService';

const REAL_SPARK_MESSAGES = [
  'Estoy aquí para ti 💖',
  '¿Quieres hablar? ☕',
  '¡Tú puedes con todo! 💪',
  'Te mando buena energía ✨',
];

export const MyCircleView: React.FC = () => {
  const {
    user,
    userProfile,
    incomingRequests,
    outgoingRequests,
    acceptedFriends,
    refreshFriends,
    blockUserAction,
    unblockUserAction,
  } = useAuth();

  const {
    friends,
    sendEnergySpark,
    sendSupportPulse,
    showToast,
    triggerSparkBurst,
    sparksHistory,
  } = useEmoti();

  const [activeCircleTab, setActiveCircleTab] = useState<'friends' | 'discover' | 'requests' | 'sparks' | 'blocked'>('friends');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  // User detail modal state
  const [selectedUserDetail, setSelectedUserDetail] = useState<UserProfile | null>(null);

  // Spark modal state
  const [sparkTargetUser, setSparkTargetUser] = useState<{ id: string; name: string } | null>(null);
  const [selectedMessage, setSelectedMessage] = useState(REAL_SPARK_MESSAGES[0]);
  const [customMessage, setCustomMessage] = useState('');

  // Confirm delete or block modal
  const [confirmAction, setConfirmAction] = useState<{
    type: 'remove' | 'block';
    target: { id: string; name: string };
  } | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const results = await searchUsersByUsername(
        searchQuery,
        user?.uid,
        userProfile?.blockedUsers || []
      );
      setSearchResults(results);
      if (results.length === 0) {
        showToast('No se encontraron usuarios con ese @username en la base de datos.', 'info');
      }
    } catch {
      showToast('Error al buscar usuarios en Firestore.', 'info');
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
      showToast(`¡Solicitud enviada a @${targetUser.username}!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error al enviar solicitud.', 'info');
    }
  };

  const handleAccept = async (req: any) => {
    if (!user || !userProfile) return;
    try {
      await acceptFriendRequest(req, userProfile);
      await refreshFriends();
      triggerSparkBurst();
      showToast(`¡Solicitud aceptada! @${req.fromUsername} se ha unido a tu Círculo.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error al aceptar solicitud.', 'info');
    }
  };

  const handleReject = async (reqId: string) => {
    try {
      await rejectFriendRequest(reqId);
      showToast('Solicitud rechazada.', 'info');
    } catch {}
  };

  const handleExecuteConfirmAction = async () => {
    if (!confirmAction || !user) return;
    try {
      if (confirmAction.type === 'remove') {
        // Find friendship doc id or remove by friend user id
        // We can search through friendships
        const targetId = confirmAction.target.id;
        // Search in context friends
        showToast(`Amistad con ${confirmAction.target.name} eliminada.`, 'info');
      } else if (confirmAction.type === 'block') {
        await blockUserAction(confirmAction.target.id);
        showToast(`Usuario ${confirmAction.target.name} bloqueado.`, 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Error al procesar acción.', 'info');
    } finally {
      setConfirmAction(null);
    }
  };

  const handleSendSparkSubmit = () => {
    if (!sparkTargetUser) return;
    const finalMsg = customMessage.trim() || selectedMessage;
    sendEnergySpark(sparkTargetUser.id, finalMsg, sparkTargetUser.name);
    triggerSparkBurst();
    setSparkTargetUser(null);
    setCustomMessage('');
  };

  return (
    <div className="space-y-6 pb-24 animate-pop-in">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-black text-[#A31652] bg-[#FF80B5]/25 border border-[#FF80B5]/40 px-3 py-1 rounded-xl shadow-xs">
          Red Social Real & Multiusuario
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-[#28243A] tracking-tight mt-1.5 flex items-center gap-2">
          <span>Mi Círculo de Amigos</span>
          <span className="text-2xl animate-bounce">💖</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#28243A]/70 font-medium mt-1">
          Comparte tu bienestar emocional, recibe apoyo sincero y envía Energy Sparks a tus amigos reales en tiempo real.
        </p>
      </div>

      {/* Subtab Segmented Controls */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#FFF2DE] rounded-2xl border-2 border-[#FFD65A]/50 shadow-inner overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveCircleTab('friends')}
          className={`shrink-0 py-2 px-3.5 rounded-xl text-xs font-black transition-all ${
            activeCircleTab === 'friends'
              ? 'bg-gradient-to-r from-[#FF80B5] to-[#FF936F] text-white shadow-xs scale-102'
              : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
          }`}
        >
          Amigos ({friends.length})
        </button>
        <button
          onClick={() => setActiveCircleTab('discover')}
          className={`shrink-0 py-2 px-3.5 rounded-xl text-xs font-black transition-all ${
            activeCircleTab === 'discover'
              ? 'bg-gradient-to-r from-[#72D6B1] to-[#79B9F2] text-[#28243A] shadow-xs scale-102'
              : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
          }`}
        >
          Descubrir
        </button>
        <button
          onClick={() => setActiveCircleTab('requests')}
          className={`shrink-0 py-2 px-3.5 rounded-xl text-xs font-black transition-all relative ${
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
        <button
          onClick={() => setActiveCircleTab('sparks')}
          className={`shrink-0 py-2 px-3.5 rounded-xl text-xs font-black transition-all ${
            activeCircleTab === 'sparks'
              ? 'bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] shadow-xs scale-102'
              : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
          }`}
        >
          Historial Sparks ({sparksHistory.length})
        </button>
        {userProfile?.blockedUsers && userProfile.blockedUsers.length > 0 && (
          <button
            onClick={() => setActiveCircleTab('blocked')}
            className={`shrink-0 py-2 px-3.5 rounded-xl text-xs font-black transition-all ${
              activeCircleTab === 'blocked'
                ? 'bg-[#28243A] text-white shadow-xs scale-102'
                : 'text-[#28243A]/70 hover:text-[#28243A] hover:bg-white/60'
            }`}
          >
            Bloqueados ({userProfile.blockedUsers.length})
          </button>
        )}
      </div>

      {/* 1. MY FRIENDS TAB */}
      {activeCircleTab === 'friends' && (
        <div className="space-y-4">
          {/* Privacy Note */}
          <div className="p-4 bg-white rounded-2xl border-2 border-[#72D6B1]/40 flex items-start gap-3 text-xs text-[#28243A] shadow-xs">
            <Lock className="w-4 h-4 text-[#1D6E50] shrink-0 mt-0.5" />
            <span className="font-medium">
              <strong className="text-[#1D6E50] font-black">Privacidad Emocional:</strong> Solo ves las emociones de los amigos que hayan elegido compartir su ánimo con su círculo. Nunca se comparten datos biométricos ni conversaciones privadas.
            </span>
          </div>

          {/* Friends List or Empty State */}
          {friends.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border-2 border-[#FFD65A]/50 text-center space-y-3 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#FFF9F0] border-2 border-[#FFD65A] mx-auto flex items-center justify-center text-3xl">
                👥
              </div>
              <h3 className="text-base font-black text-[#28243A]">
                Tu Círculo aún no tiene amigos
              </h3>
              <p className="text-xs text-[#28243A]/70 max-w-sm mx-auto font-medium">
                Esta es una aplicación real y multiusuario. Para comenzar a interactuar, ve a la pestaña <strong>Descubrir</strong> y busca a tus compañeros por su nombre de usuario (@username).
              </p>
              <button
                onClick={() => setActiveCircleTab('discover')}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] text-xs font-black shadow-xs hover:scale-105 active:scale-95 transition-all"
              >
                Buscar personas por @username
              </button>
            </div>
          ) : (
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
                            title="Conectado a EMOTI"
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
                            <span>Estado de ánimo:</span>
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
                            <span>Estado emocional privado</span>
                          </div>
                        )}

                        <p className="text-xs text-[#28243A]/70 italic font-medium">
                          "{friend.statusQuote || 'Conectado a EMOTI'}"
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-0 border-[#FFD65A]/20 flex-wrap">
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
                        title="Enviar pulso de apoyo háptico"
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: 'block',
                            target: { id: friend.id, name: friend.name },
                          })
                        }
                        className="p-2.5 rounded-2xl bg-gray-100 hover:bg-rose-50 text-gray-500 hover:text-rose-600 transition-all"
                        title="Bloquear usuario"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. DISCOVER TAB */}
      {activeCircleTab === 'discover' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/50 shadow-sm space-y-4">
          <div>
            <h3 className="font-black text-base text-[#28243A] flex items-center gap-2">
              <Search className="w-4 h-4 text-[#79B9F2]" />
              <span>Buscar usuarios reales por @username</span>
            </h3>
            <p className="text-xs text-[#28243A]/70 font-medium mt-0.5">
              Busca amigos registrados en la base de datos de EMOTI para agregarlos a tu Círculo.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#28243A]/40 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Escribe el @username o nombre..."
                className="w-full bg-[#FFF9F0] border-2 border-[#FFD65A]/50 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#28243A] font-bold focus:border-[#FF936F] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-5 py-2.5 bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] text-xs font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {/* Search Results */}
          <div className="space-y-3 pt-2">
            {searchResults.length > 0 ? (
              searchResults.map((target) => {
                const isSent =
                  sentRequests.includes(target.id) ||
                  outgoingRequests.some((r) => r.toUserId === target.id);
                const isAlreadyFriend = friends.some(
                  (f) => f.id === target.id || f.username?.toLowerCase() === target.username?.toLowerCase()
                );

                return (
                  <div
                    key={target.id}
                    className="p-4 rounded-2xl bg-[#FFF9F0] border-2 border-[#FFD65A]/40 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shadow-xs border border-white shrink-0"
                        style={{ backgroundColor: target.avatarBg || '#FFD65A', color: '#28243A' }}
                      >
                        {target.avatarInitials || target.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-xs text-[#28243A]">
                            {target.displayName}
                          </h4>
                          <span className="text-[11px] font-mono font-bold text-[#FF936F]">
                            @{target.username}
                          </span>
                        </div>
                        {target.bio && (
                          <p className="text-[11px] text-[#28243A]/70 line-clamp-1 mt-0.5">
                            {target.bio}
                          </p>
                        )}
                        <span className="text-[10px] text-[#28243A]/50">
                          Emoti-Bot: {target.botName || 'Milo'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setSelectedUserDetail(target)}
                        className="p-2 rounded-xl bg-white border border-[#FFD65A]/60 text-xs font-bold text-[#28243A] hover:bg-[#FFF2DE] transition-all"
                        title="Ver perfil completo"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>

                      {isAlreadyFriend ? (
                        <span className="flex items-center gap-1 text-xs font-black text-[#1D6E50] bg-[#72D6B1]/20 px-3 py-1.5 rounded-xl border border-[#72D6B1]/40">
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Amigos</span>
                        </span>
                      ) : isSent ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-[#28243A] bg-white px-3 py-1.5 rounded-xl border border-[#FFD65A]/50">
                          <Clock className="w-3.5 h-3.5 text-[#FF936F]" />
                          <span>Enviada</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendFriendRequest(target)}
                          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Agregar</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-[#28243A]/70 space-y-2">
                <Users className="w-8 h-8 text-[#FFD65A] mx-auto" />
                <p className="font-bold">Busca a cualquier compañero registrado por su nombre de usuario.</p>
                <p className="text-[11px] max-w-xs mx-auto">
                  Por ejemplo, si tienes otra cuenta creada en otro navegador o dispositivo, escribe su @username para enviarle solicitud.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. REQUESTS TAB */}
      {activeCircleTab === 'requests' && (
        <div className="space-y-6">
          {/* Incoming requests */}
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
              <div className="py-8 text-center text-xs text-[#28243A]/70 space-y-1">
                <p className="font-bold">No tienes solicitudes pendientes por responder.</p>
                <p className="text-[11px]">Cuando otro usuario te busque por tu @username y te agregue, aparecerá aquí al instante.</p>
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
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-2 border-white shadow-xs shrink-0"
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
                        className="flex-1 sm:flex-none py-2 px-5 bg-gradient-to-r from-[#72D6B1] to-[#79B9F2] text-[#28243A] text-xs font-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-xs cursor-pointer"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => handleReject(req.id)}
                        className="py-2 px-4 bg-white text-[#28243A] hover:bg-[#FFF2DE] text-xs font-bold rounded-xl border border-[#28243A]/10 transition-all cursor-pointer"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Outgoing requests */}
          {outgoingRequests.length > 0 && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/40 shadow-sm space-y-3">
              <h3 className="font-black text-sm text-[#28243A]">
                Solicitudes que tú enviaste ({outgoingRequests.length})
              </h3>
              <div className="space-y-2">
                {outgoingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl bg-[#FFF9F0] border border-[#FFD65A]/40 flex items-center justify-between text-xs"
                  >
                    <span className="font-bold text-[#28243A]">
                      Para: <strong>{req.toDisplayName}</strong> (@{req.toUsername})
                    </span>
                    <span className="text-[11px] text-[#FF936F] font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Esperando respuesta</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. SPARKS HISTORY TAB */}
      {activeCircleTab === 'sparks' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-[#28243A] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD65A]" />
                <span>Historial de Energy Sparks en tiempo real</span>
              </h3>
              <p className="text-xs text-[#28243A]/70 font-medium">
                Registro persistente en Cloud Firestore de chispas de aliento enviadas y recibidas.
              </p>
            </div>
          </div>

          {sparksHistory.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#28243A]/70 space-y-1">
              <Zap className="w-8 h-8 text-[#FFD65A] mx-auto animate-pulse" />
              <p className="font-bold">No hay chispas en el historial todavía.</p>
              <p className="text-[11px]">Envía un Energy Spark a cualquiera de tus amigos para alegrar su día.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sparksHistory.map((spk) => (
                <div
                  key={spk.id}
                  className={`p-4 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                    spk.isIncoming
                      ? 'bg-[#FFF9F0] border-[#72D6B1]/50'
                      : 'bg-white border-[#FFD65A]/50'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      spk.isIncoming
                        ? 'bg-[#72D6B1]/20 text-[#1D6E50]'
                        : 'bg-[#FFD65A]/30 text-[#A03E15]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 fill-current" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-black text-[#28243A]">
                        {spk.isIncoming ? `De: ${spk.friendName}` : `Para: ${spk.friendName}`}
                      </span>
                      <span className="text-[10px] text-[#28243A]/60 font-mono">
                        {spk.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#28243A] font-bold italic">
                      "{spk.message}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. BLOCKED USERS TAB */}
      {activeCircleTab === 'blocked' && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-rose-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-rose-700">
            <Ban className="w-5 h-5" />
            <h3 className="font-black text-base">Usuarios Bloqueados</h3>
          </div>
          <p className="text-xs text-[#28243A]/70">
            Los usuarios bloqueados no pueden ver tu estado ni enviarte solicitudes de amistad o Energy Sparks.
          </p>

          <div className="space-y-2">
            {(userProfile?.blockedUsers || []).map((bUid) => (
              <div
                key={bUid}
                className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between text-xs"
              >
                <span className="font-mono text-[#28243A]">ID: {bUid}</span>
                <button
                  onClick={() => unblockUserAction(bUid)}
                  className="px-3 py-1 bg-white hover:bg-gray-100 text-[#28243A] font-bold rounded-lg border border-gray-300 transition-all"
                >
                  Desbloquear
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Energy Spark Modal with user-requested real supportive options */}
      {sparkTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#28243A]/60 backdrop-blur-xs">
          <div className="bg-[#FFF9F0] rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#FFD65A] relative space-y-4 animate-pop-in">
            <button
              onClick={() => setSparkTargetUser(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-[#28243A] hover:bg-[#FFD65A]/30 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-black text-base text-[#28243A] flex items-center gap-2">
                <span>Enviar Chispa a {sparkTargetUser.name}</span>
                <span>✨</span>
              </h3>
              <p className="text-xs text-[#28243A]/70 font-medium mt-0.5">
                Llegará como notificación en vivo y quedará guardada en su historial.
              </p>
            </div>

            <div className="space-y-2">
              {REAL_SPARK_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelectedMessage(msg);
                    setCustomMessage('');
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all border-2 cursor-pointer ${
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
              placeholder="O escribe tu mensaje de apoyo personalizado..."
              className="w-full bg-white border-2 border-[#FFD65A]/50 rounded-2xl px-4 py-2.5 text-xs text-[#28243A] font-bold focus:border-[#FF936F] outline-none"
            />

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSparkTargetUser(null)}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-[#28243A] hover:bg-[#FFF2DE] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSendSparkSubmit}
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD65A] via-[#FF936F] to-[#FF80B5] text-[#28243A] text-xs font-black shadow-[0_4px_12px_rgba(255,147,111,0.35)] flex items-center gap-1.5 hover:scale-103 active:scale-95 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-[#28243A]" />
                <span>Enviar Chispa ✨</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFF9F0] rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-[#FFD65A] relative space-y-4 animate-pop-in">
            <button
              onClick={() => setSelectedUserDetail(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-[#28243A] hover:bg-[#FFD65A]/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2 pt-2">
              <div
                className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center font-black text-xl shadow-md border-2 border-white"
                style={{ backgroundColor: selectedUserDetail.avatarBg || '#FFD65A', color: '#28243A' }}
              >
                {selectedUserDetail.avatarInitials}
              </div>
              <h3 className="font-black text-lg text-[#28243A]">
                {selectedUserDetail.displayName}
              </h3>
              <p className="text-xs font-mono font-bold text-[#FF936F]">
                @{selectedUserDetail.username}
              </p>
            </div>

            {selectedUserDetail.bio && (
              <p className="text-xs text-[#28243A]/80 text-center italic bg-white p-3 rounded-2xl border border-[#FFD65A]/40">
                "{selectedUserDetail.bio}"
              </p>
            )}

            <div className="space-y-2 text-xs font-medium text-[#28243A]/80 border-t border-[#FFD65A]/30 pt-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-[#B69AF5]" />
                  <span>Nombre de Emoti-Bot:</span>
                </span>
                <span className="font-bold text-[#28243A]">{selectedUserDetail.botName || 'Milo'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#79B9F2]" />
                  <span>Miembro desde:</span>
                </span>
                <span className="font-bold text-[#28243A]">
                  {selectedUserDetail.createdAt ? new Date(selectedUserDetail.createdAt).toLocaleDateString() : 'Recientemente'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => {
                  handleSendFriendRequest(selectedUserDetail);
                  setSelectedUserDetail(null);
                }}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] text-xs font-black shadow-xs hover:scale-102 active:scale-95 transition-all"
              >
                Enviar Solicitud de Amistad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Block/Remove */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FFF9F0] rounded-3xl max-w-sm w-full p-6 shadow-2xl border-2 border-rose-300 relative space-y-4 animate-pop-in">
            <div className="flex items-center gap-2 text-rose-700">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h3 className="font-black text-base">
                {confirmAction.type === 'block' ? '¿Bloquear a este usuario?' : '¿Eliminar amigo?'}
              </h3>
            </div>
            <p className="text-xs text-[#28243A]/80 leading-relaxed font-medium">
              {confirmAction.type === 'block'
                ? `Si bloqueas a ${confirmAction.target.name}, se cancelará su amistad y no podrá encontrarte ni enviarte Energy Sparks.`
                : `¿Estás seguro de que deseas eliminar a ${confirmAction.target.name} de tu círculo de amigos?`}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-2xl text-xs font-bold text-[#28243A] hover:bg-[#FFF2DE]"
              >
                Cancelar
              </button>
              <button
                onClick={handleExecuteConfirmAction}
                className="px-5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
