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
  Radio
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
    showToast 
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

  // Profile modal state
  const [selectedFriendProfile, setSelectedFriendProfile] = useState<UserProfile | null>(null);

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
      showToast(`¡Solicitud aceptada! @${req.fromUsername} ahora está en Mi Círculo.`, 'success');
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
    setSparkTargetUser(null);
    setCustomMessage('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-[#4F4275] bg-[#DCD5F5]/60 px-2 py-0.5 rounded-md">
          Red Social Consciente
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292A30] tracking-tight mt-1">
          MY CIRCLE
        </h1>
        <p className="text-xs sm:text-sm text-[#50545E] mt-1">
          Tu red íntima de amistades para compartir bienestar, acompañamiento y soporte mutuo sin invasión.
        </p>
      </div>

      {/* Subtab Segmented Controls */}
      <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-[#ECEDEF] shadow-xs">
        <button
          onClick={() => setActiveCircleTab('friends')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeCircleTab === 'friends'
              ? 'bg-[#292A30] text-white shadow-xs'
              : 'text-[#50545E] hover:text-[#292A30]'
          }`}
        >
          Mis amigos ({friends.length})
        </button>
        <button
          onClick={() => setActiveCircleTab('discover')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
            activeCircleTab === 'discover'
              ? 'bg-[#292A30] text-white shadow-xs'
              : 'text-[#50545E] hover:text-[#292A30]'
          }`}
        >
          Descubrir
        </button>
        <button
          onClick={() => setActiveCircleTab('requests')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all relative ${
            activeCircleTab === 'requests'
              ? 'bg-[#292A30] text-white shadow-xs'
              : 'text-[#50545E] hover:text-[#292A30]'
          }`}
        >
          <span>Solicitudes</span>
          {incomingRequests.length > 0 && (
            <span className="ml-1.5 px-1.5 py-0.2 bg-purple-600 text-white rounded-full text-[10px]">
              {incomingRequests.length}
            </span>
          )}
        </button>
      </div>

      {/* 1. MY FRIENDS TAB */}
      {activeCircleTab === 'friends' && (
        <div className="space-y-4">
          {/* Privacy Note */}
          <div className="p-3.5 bg-[#F8F7F4] rounded-2xl border border-[#ECEDEF] flex items-start gap-2.5 text-xs text-[#50545E]">
            <Lock className="w-4 h-4 text-[#4F4275] shrink-0 mt-0.5" />
            <span>
              <strong>Visibilidad de estado emocional:</strong> Solo visualizas las emociones de amigos que han configurado compartir su ánimo con su círculo. No se comparte ninguna información biométrica privada.
            </span>
          </div>

          {/* Friends List */}
          <div className="space-y-3">
            {friends.map((friend) => {
              const moodMeta = friend.sharedMood ? EMOTIONS_CONFIG[friend.sharedMood] : null;

              return (
                <div
                  key={friend.id}
                  className="bg-white rounded-3xl p-5 border border-[#ECEDEF] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#DCD5F5] transition-all"
                >
                  {/* Left: Avatar & Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="relative shrink-0">
                      <div
                        className="w-13 h-13 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs"
                        style={{ backgroundColor: friend.avatarBg, color: friend.avatarColor }}
                      >
                        {friend.avatarInitials}
                      </div>
                      {friend.isOnline && (
                        <span
                          className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"
                          title="En línea"
                        />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm sm:text-base text-[#292A30]">
                          {friend.name}
                        </h3>
                        {friend.username && (
                          <span className="text-[11px] font-mono text-[#7A7E89]">
                            @{friend.username}
                          </span>
                        )}
                      </div>

                      {/* Shared Mood Display */}
                      {moodMeta && friend.moodVisibility !== 'nobody' ? (
                        <div className="flex items-center gap-1.5 text-xs text-[#50545E]">
                          <span>Estado actual:</span>
                          <span className="font-semibold text-[#292A30] capitalize flex items-center gap-1">
                            <span>{moodMeta.emoji}</span>
                            <span>{moodMeta.label}</span>
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-[#7A7E89]">
                          <Lock className="w-3 h-3" />
                          <span>Estado privado</span>
                        </div>
                      )}

                      <p className="text-xs text-[#50545E] italic">
                        "{friend.statusQuote}"
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 sm:pt-0 border-t sm:border-0 border-[#ECEDEF]">
                    <button
                      onClick={() =>
                        setSparkTargetUser({ id: friend.id, name: friend.name })
                      }
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#DCD5F5] to-[#E5DFFA] hover:from-[#d1c8f4] hover:to-[#dbd3f8] text-[#372A5E] text-xs font-semibold shadow-xs transition-transform active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#4F4275]" />
                      <span>Chispa ✨</span>
                    </button>

                    <button
                      onClick={() => sendSupportPulse(friend.name, friend.id)}
                      className="p-2 rounded-xl bg-[#F5DFD3]/60 hover:bg-[#F5DFD3] text-[#8C5835] transition-colors"
                      title="Enviar pulso háptico de apoyo"
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
        <div className="bg-white rounded-3xl p-5 border border-[#ECEDEF] shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#292A30]">
              Buscar amigos por @username
            </h3>
            <p className="text-xs text-[#50545E] mt-0.5">
              Encuentra amigos que usen EMOTI para conectarse y compartir apoyo.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ej. sofia, mateo, alex..."
                className="w-full bg-[#F8F7F4] border border-[#D6D8DC] rounded-xl pl-9 pr-3 py-2 text-xs text-[#292A30] focus:ring-2 focus:ring-[#DCD5F5] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-4 py-2 bg-[#292A30] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs disabled:opacity-50"
            >
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {/* Search Results */}
          <div className="space-y-2.5 pt-2">
            {searchResults.length > 0 ? (
              searchResults.map((target) => {
                const isSent = sentRequests.includes(target.id);
                const isAlreadyFriend = friends.some(
                  (f) => f.username?.toLowerCase() === target.username?.toLowerCase()
                );

                return (
                  <div
                    key={target.id}
                    className="p-3.5 rounded-2xl bg-[#F8F7F4] border border-[#ECEDEF] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: target.avatarBg || '#DCD5F5' }}
                      >
                        {target.avatarInitials || target.displayName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#292A30]">
                          {target.displayName}
                        </h4>
                        <p className="text-[11px] font-mono text-[#7A7E89]">
                          @{target.username}
                        </p>
                      </div>
                    </div>

                    {isAlreadyFriend ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Amigos</span>
                      </span>
                    ) : isSent ? (
                      <span className="flex items-center gap-1 text-xs text-[#50545E] bg-white px-2.5 py-1 rounded-xl border border-[#D6D8DC]">
                        <Clock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Solicitud enviada</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSendFriendRequest(target)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#292A30] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-[#DCD5F5]" />
                        <span>Agregar</span>
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-6 text-center text-xs text-[#7A7E89]">
                Prueba buscar cuentas demo como: <strong>@sofia</strong>, <strong>@mateo</strong> o <strong>@valentina</strong>.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. REQUESTS TAB */}
      {activeCircleTab === 'requests' && (
        <div className="bg-white rounded-3xl p-5 border border-[#ECEDEF] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#292A30]">
              Solicitudes de amistad recibidas
            </h3>
            <span className="text-xs text-[#7A7E89]">
              {incomingRequests.length} pendientes
            </span>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#7A7E89] space-y-1">
              <Users className="w-8 h-8 mx-auto text-gray-300 opacity-60" />
              <p>No tienes solicitudes de amistad pendientes.</p>
              <p className="text-[11px]">Cuando alguien te agregue por tu @username, aparecerá aquí.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-2xl bg-[#F8F7F4] border border-[#DCD5F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: req.fromAvatarBg }}
                    >
                      {req.fromAvatarInitials}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-[#292A30]">
                        {req.fromDisplayName}
                      </h4>
                      <p className="text-[11px] font-mono text-[#50545E]">
                        @{req.fromUsername}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAccept(req)}
                      className="flex-1 sm:flex-none py-1.5 px-4 bg-[#292A30] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="py-1.5 px-3 bg-white text-[#50545E] hover:bg-[#ECEDEF] text-xs font-semibold rounded-xl border border-[#D6D8DC] transition-all"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#ECEDEF] relative space-y-4">
            <button
              onClick={() => setSparkTargetUser(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#50545E] hover:bg-[#ECEDEF] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-bold text-base text-[#292A30]">
                Enviar chispa a {sparkTargetUser.name} ✨
              </h3>
              <p className="text-xs text-[#50545E]">
                El mensaje aparecerá en sus notificaciones en tiempo real.
              </p>
            </div>

            <div className="space-y-1.5">
              {QUICK_SPARK_MESSAGES.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSelectedMessage(msg);
                    setCustomMessage('');
                  }}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all ${
                    selectedMessage === msg && !customMessage
                      ? 'bg-[#DCD5F5]/60 text-[#292A30] font-semibold border border-[#DCD5F5]'
                      : 'bg-[#F8F7F4] text-[#50545E] hover:bg-[#ECEDEF]'
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
              className="w-full bg-[#F8F7F4] border border-[#D6D8DC] rounded-xl px-3.5 py-2 text-xs text-[#292A30] focus:ring-2 focus:ring-[#DCD5F5] outline-none"
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setSparkTargetUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#50545E] hover:bg-[#ECEDEF]"
              >
                Cancelar
              </button>
              <button
                onClick={handleSendSparkSubmit}
                className="px-5 py-2 rounded-xl bg-[#292A30] hover:bg-black text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#DCD5F5]" />
                <span>Enviar Chispa</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
