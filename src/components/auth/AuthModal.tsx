import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useEmoti } from '../../context/EmotiContext';
import { 
  X, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  AtSign, 
  User as UserIcon, 
  Lock, 
  AlertCircle,
  CheckCircle2,
  Users
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, loginWithGoogle, register, resetPassword, loginDemo, loading } = useAuth();
  const { showToast } = useEmoti();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      showToast('¡Sesión iniciada con Google en tiempo real!', 'success');
      onClose();
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Ventana de inicio cerrada. Puedes intentar nuevamente.');
      } else {
        setErrorMsg('No se pudo completar el inicio de sesión con Google. Puedes usar una cuenta de prueba.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        showToast('¡Sesión iniciada con éxito!', 'success');
        onClose();
      } else if (mode === 'register') {
        if (!displayName.trim() || !username.trim()) {
          setErrorMsg('Por favor completa tu nombre y nombre de usuario (@username).');
          setIsSubmitting(false);
          return;
        }
        await register(email, password, displayName, username);
        showToast('¡Cuenta creada con éxito! Bienvenido a EMOTI.', 'success');
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Si el correo está registrado, recibirás un enlace de restablecimiento.');
        showToast('Solicitud enviada.', 'info');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Este correo ya está registrado. Prueba iniciando sesión.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Credenciales incorrectas. Verifica tu correo o contraseña.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('El formato del correo electrónico no es válido.');
      } else {
        setErrorMsg(err.message || 'Ocurrió un error inesperado al conectar.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (demoUsername: string) => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await loginDemo(demoUsername);
      showToast(`Conectado como @${demoUsername} (Modo prueba)`, 'spark');
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al conectar cuenta demo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#ECEDEF] relative space-y-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#50545E] hover:bg-[#ECEDEF] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#292A30] text-white flex items-center justify-center font-bold text-sm">
              E
            </div>
            <h2 className="text-xl font-bold text-[#292A30] tracking-tight">
              {mode === 'login' && 'Iniciar sesión en EMOTI'}
              {mode === 'register' && 'Crear cuenta personal'}
              {mode === 'forgot' && 'Recuperar contraseña'}
            </h2>
          </div>
          <p className="text-xs text-[#50545E] mt-1">
            {mode === 'login' && 'Conecta tu cuenta para sincronizar tus dispositivos en tiempo real.'}
            {mode === 'register' && 'Únete a la red de bienestar emocional y sincroniza tu Emoti-Bot.'}
            {mode === 'forgot' && 'Ingresa tu correo para recibir un enlace de restablecimiento.'}
          </p>
        </div>

        {/* Error / Success Notices */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2 text-xs text-emerald-700">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google Sign-in Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || loading}
          className="w-full py-2.5 px-4 bg-white hover:bg-[#F8F7F4] text-[#292A30] text-xs font-semibold rounded-xl border border-[#D6D8DC] transition-all shadow-xs flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-98 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Continuar con Google</span>
        </button>

        {/* Divider */}
        <div className="relative flex py-1 items-center">
          <div className="grow border-t border-[#ECEDEF]"></div>
          <span className="shrink mx-3 text-[10px] text-[#7A7E89] uppercase tracking-wider font-semibold">
            o con correo
          </span>
          <div className="grow border-t border-[#ECEDEF]"></div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-[11px] font-semibold text-[#50545E] block mb-1">
                  Nombre visible
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ej. Alex Morales"
                    className="w-full bg-[#F8F7F4] border border-[#D6D8DC] rounded-xl pl-9 pr-3 py-2 text-xs text-[#292A30] focus:ring-2 focus:ring-[#DCD5F5] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#50545E] block mb-1">
                  Usuario único (@handle)
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="alexm (sin espacios)"
                    className="w-full bg-[#F8F7F4] border border-[#D6D8DC] rounded-xl pl-9 pr-3 py-2 text-xs text-[#292A30] focus:ring-2 focus:ring-[#DCD5F5] outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-semibold text-[#50545E] block mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full bg-[#F8F7F4] border border-[#D6D8DC] rounded-xl px-3.5 py-2 text-xs text-[#292A30] focus:ring-2 focus:ring-[#DCD5F5] outline-none"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[#50545E]">
                  Contraseña
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-[#4F4275] hover:underline font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#F8F7F4] border border-[#D6D8DC] rounded-xl pl-9 pr-3 py-2 text-xs text-[#292A30] focus:ring-2 focus:ring-[#DCD5F5] outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-2.5 px-4 bg-[#292A30] hover:bg-black text-white text-xs font-semibold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Procesando...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>Ingresar con correo</span>
              </>
            ) : mode === 'register' ? (
              <>
                <UserPlus className="w-3.5 h-3.5" />
                <span>Crear cuenta</span>
              </>
            ) : (
              <>
                <KeyRound className="w-3.5 h-3.5" />
                <span>Enviar correo de recuperación</span>
              </>
            )}
          </button>
        </form>

        {/* Switch between Login / Register */}
        <div className="text-center text-xs text-[#50545E] pt-1">
          {mode === 'login' ? (
            <p>
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#4F4275] font-bold hover:underline cursor-pointer"
              >
                Regístrate aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#4F4275] font-bold hover:underline cursor-pointer"
              >
                Inicia sesión
              </button>
            </p>
          )}
        </div>

        {/* Quick Demo Switcher for fast multi-device testing */}
        <div className="pt-3 border-t border-[#ECEDEF] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#50545E] flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#4F4275]" />
              <span>Cuentas de demostración rápida:</span>
            </span>
            <span className="text-[10px] text-[#7A7E89]">1-click test</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'alex', label: 'Alex (@alex)' },
              { id: 'sofia', label: 'Sofía (@sofia)' },
              { id: 'mateo', label: 'Mateo (@mateo)' },
              { id: 'valentina', label: 'Valentina (@valentina)' },
              { id: 'diego', label: 'Diego (@diego)' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => handleQuickDemo(d.id)}
                disabled={isSubmitting}
                className="px-2.5 py-1 rounded-lg bg-[#F8F7F4] hover:bg-[#DCD5F5]/60 text-[11px] font-medium text-[#292A30] border border-[#ECEDEF] transition-all disabled:opacity-50 cursor-pointer"
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[#7A7E89] italic">
            Ideal para probar sincronización en vivo entre pestañas o dispositivos.
          </p>
        </div>
      </div>
    </div>
  );
};
