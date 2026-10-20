import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmoti } from '../../context/EmotiContext';
import { 
  X, 
  Bell, 
  Sparkles, 
  Heart, 
  UserPlus, 
  Check, 
  Clock, 
  CheckCheck,
  MessageCircle,
  Zap
} from 'lucide-react';
import { 
  acceptFriendRequest, 
  rejectFriendRequest, 
  markNotificationAsRead 
} from '../../services/firebaseService';

interface NotificationCenterProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen = true,
  onClose,
}) => {
  const { user, userProfile, notifications, incomingRequests, refreshFriends } = useAuth();
  const { sendEnergySpark, showToast, setActiveTab, triggerSparkBurst } = useEmoti();

  if (!isOpen) return null;

  const handleAcceptRequest = async (req: any) => {
    if (!user) return;
    try {
      await acceptFriendRequest(req, user.uid);
      await refreshFriends();
      triggerSparkBurst();
      showToast(`¡Ahora eres amigo de ${req.fromDisplayName}! ✨`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error al aceptar solicitud', 'info');
    }
  };

  const handleRejectRequest = async (reqId: string) => {
    try {
      await rejectFriendRequest(reqId);
      showToast('Solicitud rechazada', 'info');
    } catch {}
  };

  const handleReplySpark = (senderId: string, senderName: string) => {
    sendEnergySpark(senderId, '¡Gracias por tu apoyo! Te mando un abrazo gigante ✨', senderName);
    triggerSparkBurst();
    onClose();
  };

  const handleMarkRead = (notifId: string) => {
    if (!user) return;
    markNotificationAsRead(user.uid, notifId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-[#28243A]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFF9F0] rounded-3xl max-w-sm w-full p-5 shadow-2xl border-2 border-[#FFD65A] relative space-y-4 max-h-[85vh] flex flex-col mt-12 sm:mr-4 animate-pop-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#FFD65A]/30 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FFD65A] to-[#FF936F] text-[#28243A] flex items-center justify-center font-black shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <h3 className="font-black text-sm text-[#28243A]">Notificaciones en Vivo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#28243A] hover:bg-[#FFD65A]/30 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list with scroll */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* Pending Friend Requests */}
          {incomingRequests.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-black text-[#58399E] uppercase tracking-wider block">
                Solicitudes de amistad ({incomingRequests.length})
              </span>
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-2xl bg-white border-2 border-[#B69AF5]/50 space-y-2.5 shadow-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs border border-white shadow-xs"
                      style={{ backgroundColor: req.fromAvatarBg || '#FFD65A', color: '#28243A' }}
                    >
                      {req.fromAvatarInitials}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-[#28243A]">
                        {req.fromDisplayName}
                      </h4>
                      <p className="text-[10px] font-mono font-bold text-[#FF936F]">@{req.fromUsername}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="flex-1 py-1.5 px-3 bg-gradient-to-r from-[#72D6B1] to-[#79B9F2] text-[#28243A] text-xs font-black rounded-xl hover:scale-102 transition-all shadow-xs"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => handleRejectRequest(req.id)}
                      className="py-1.5 px-3 bg-[#FFF9F0] text-[#28243A] hover:bg-[#FFF2DE] text-xs font-bold rounded-xl border border-[#28243A]/10 transition-all"
                    >
                      Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Social Notifications */}
          <div className="space-y-2">
            <span className="text-[11px] font-black text-[#28243A]/70 uppercase tracking-wider block">
              Actividad Reciente
            </span>

            {notifications.length === 0 && incomingRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#28243A]/60 space-y-1">
                <Bell className="w-8 h-8 mx-auto text-[#FFD65A] animate-bounce" />
                <p className="font-bold">No tienes notificaciones pendientes.</p>
                <p className="text-[11px]">Las chispas y pulsos de tus amigos aparecerán aquí en vivo.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id)}
                  className={`p-3.5 rounded-2xl border-2 transition-all text-xs space-y-1.5 ${
                    notif.read
                      ? 'bg-white/80 border-[#FFD65A]/30 opacity-80'
                      : 'bg-white border-[#FF936F] shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {notif.type === 'energy_spark' && (
                        <Zap className="w-4 h-4 text-[#946200] fill-[#FFD65A] shrink-0" />
                      )}
                      {notif.type === 'support_pulse' && (
                        <Heart className="w-4 h-4 text-[#FF80B5] fill-[#FF80B5] shrink-0 animate-pulse" />
                      )}
                      {notif.type === 'friend_accepted' && (
                        <UserPlus className="w-4 h-4 text-[#1D6E50] shrink-0" />
                      )}
                      <span className="font-black text-[#28243A] truncate">
                        {notif.senderName}
                      </span>
                    </div>
                    {!notif.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#FF80B5] shrink-0 animate-ping" />
                    )}
                  </div>

                  <p className="text-xs text-[#28243A]/80 font-medium leading-snug">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#28243A]/60 font-semibold">
                    <span className="font-mono">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {notif.type === 'energy_spark' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReplySpark(notif.senderId, notif.senderName);
                        }}
                        className="text-[#FF936F] font-black hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Responder chispa</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t-2 border-[#FFD65A]/30 flex justify-between items-center text-[11px] font-bold text-[#28243A]/70 shrink-0">
          <span>Actualización en tiempo real</span>
          <button
            onClick={() => {
              onClose();
              setActiveTab('circle');
            }}
            className="text-[#FF936F] font-black hover:underline"
          >
            Ir a Mi Círculo ↗
          </button>
        </div>
      </div>
    </div>
  );
};
