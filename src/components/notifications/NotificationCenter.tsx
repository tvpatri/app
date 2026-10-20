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
  MessageCircle
} from 'lucide-react';
import { 
  acceptFriendRequest, 
  rejectFriendRequest, 
  markNotificationAsRead 
} from '../../services/firebaseService';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, userProfile, notifications, incomingRequests, refreshFriends } = useAuth();
  const { sendEnergySpark, showToast, setActiveTab } = useEmoti();

  if (!isOpen) return null;

  const handleAcceptRequest = async (req: any) => {
    if (!user) return;
    try {
      await acceptFriendRequest(req, user.uid);
      await refreshFriends();
      showToast(`¡Ahora eres amigo de ${req.fromDisplayName}!`, 'success');
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
    sendEnergySpark(senderId, '¡Gracias por tu apoyo! Te mando un abrazo ✨', senderName);
    onClose();
  };

  const handleMarkRead = (notifId: string) => {
    if (!user) return;
    markNotificationAsRead(user.uid, notifId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-[#ECEDEF] relative space-y-4 max-h-[85vh] flex flex-col mt-12 sm:mr-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ECEDEF] shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#4F4275]" />
            <h3 className="font-bold text-sm text-[#292A30]">Notificaciones en vivo</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#50545E] hover:bg-[#ECEDEF] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list with scroll */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {/* Pending Friend Requests */}
          {incomingRequests.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#4F4275] uppercase tracking-wider block">
                Solicitudes de amistad ({incomingRequests.length})
              </span>
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-3 rounded-2xl bg-[#DCD5F5]/30 border border-[#DCD5F5] space-y-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs"
                      style={{ backgroundColor: req.fromAvatarBg }}
                    >
                      {req.fromAvatarInitials}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#292A30]">
                        {req.fromDisplayName}
                      </h4>
                      <p className="text-[10px] text-[#50545E]">@{req.fromUsername}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleAcceptRequest(req)}
                      className="flex-1 py-1.5 px-3 bg-[#292A30] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
                    >
                      Aceptar
                    </button>
                    <button
                      onClick={() => handleRejectRequest(req.id)}
                      className="py-1.5 px-3 bg-white text-[#50545E] hover:bg-[#ECEDEF] text-xs font-semibold rounded-xl border border-[#D6D8DC] transition-all"
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
            <span className="text-[11px] font-bold text-[#50545E] uppercase tracking-wider block">
              Actividad reciente
            </span>

            {notifications.length === 0 && incomingRequests.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#7A7E89] space-y-1">
                <Bell className="w-8 h-8 mx-auto text-gray-300 opacity-60" />
                <p>No tienes notificaciones pendientes.</p>
                <p className="text-[11px]">Las chispas y pulsos de tus amigos aparecerán aquí.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id)}
                  className={`p-3 rounded-2xl border transition-all text-xs space-y-1.5 ${
                    notif.read
                      ? 'bg-white border-[#ECEDEF] opacity-75'
                      : 'bg-[#F8F7F4] border-[#DCD5F5] shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {notif.type === 'energy_spark' && (
                        <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      )}
                      {notif.type === 'support_pulse' && (
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 shrink-0 animate-pulse" />
                      )}
                      {notif.type === 'friend_accepted' && (
                        <UserPlus className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      )}
                      <span className="font-bold text-[#292A30] truncate">
                        {notif.senderName}
                      </span>
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-[#50545E] leading-snug">
                    {notif.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#7A7E89]">
                    <span className="font-mono">
                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {notif.type === 'energy_spark' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReplySpark(notif.senderId, notif.senderName);
                        }}
                        className="text-[#4F4275] font-semibold hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-2.5 h-2.5" />
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
        <div className="pt-2 border-t border-[#ECEDEF] flex justify-between items-center text-[11px] text-[#7A7E89] shrink-0">
          <span>Actualización en tiempo real</span>
          <button
            onClick={() => {
              onClose();
              setActiveTab('circle');
            }}
            className="text-[#4F4275] font-semibold hover:underline"
          >
            Ir a Mi Círculo
          </button>
        </div>
      </div>
    </div>
  );
};
