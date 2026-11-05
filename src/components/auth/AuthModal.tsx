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
  FileText,
  MailCheck,
} from 'lucide-react';

interface AuthModalProps {
  isOpen?: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen = true,
  onClose,
  initialMode = 'login',
}) => {
  const { login, loginWithGoogle, register, resetPassword, loading } = useAuth();
  const { showToast } = useEmoti();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
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
        setErrorMsg('Ventana de inicio cerrada por el usuario.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setErrorMsg('Dominio no autorizado en Firebase. Agrega tu dominio en Firebase Console > Authentication > Settings > Authorized domains.');
      } else {
        setErrorMsg(err.message || 'No se pudo completar el inicio de sesión con Google.');
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
        showToast('¡Sesión iniciada correctamente!', 'success');
        onClose();
      } else if (mode === 'register') {
        if (!displayName.trim() || !username.trim()) {
          setErrorMsg('Por favor completa tu nombre visible y tu @username.');
          setIsSubmitting(false);
          return;
        }
        await register(email, password, displayName, username, bio);
        showToast('¡Cuenta creada con éxito! Hemos enviado un enlace de verificación a tu correo.', 'success');
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setSuccessMsg('Si el correo está registrado en EMOTI, recibirás las instrucciones para restablecer tu contraseña.');
        showToast('Correo de recuperación enviado.', 'info');
      }
    } catch (err: any) {
      console.error('Auth submit error:', err);
      if (err.code === 'auth/operation-not-allowed') {
        setErrorMsg(
          'El proveedor de Correo/Contraseña aún no está activado en tu proyecto de Firebase. Actívalo en Firebase Console > Authentication > Sign-in method > Email/Password, o usa Continuar con Google.'
        );
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Este correo ya está registrado. Si ya tienes cuenta, inicia sesión.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Correo o contraseña incorrectos. Verifica tus credenciales.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('La contraseña debe tener un mínimo de 6 caracteres.');
      } else if (err.code === 'auth/invalid-email') {
        setErrorMsg('El formato del correo electrónico no es válido.');
      } else if (err.code === 'auth/too-many-requests') {
        setErrorMsg('Demasiados intentos fallidos. Por seguridad, espera unos minutos antes de reintentar.');
      } else {
        setErrorMsg(err.message || 'Error al autenticar con el servidor de Firebase.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[#FFF9F0] rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-[#FFD65A] relative space-y-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-[#28243A] hover:bg-[#FFD65A]/30 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF936F] to-[#FF80B5] text-white flex items-center justify-center font-black text-sm shadow-xs">
              E
            </div>
            <h2 className="text-xl font-black text-[#28243A] tracking-tight">
              {mode === 'login' && 'Iniciar Sesión'}
              {mode === 'register' && 'Crear Cuenta Real'}
              {mode === 'forgot' && 'Recuperar Contraseña'}
            </h2>
          </div>
          <p className="text-xs text-[#28243A]/70 font-medium mt-1">
            {mode === 'login' && 'Accede a tu cuenta real de EMOTI para sincronizar amigos y dispositivos en la nube.'}
            {mode === 'register' && 'Crea tu perfil multiusuario con Firebase para conectar con amigos reales.'}
            {mode === 'forgot' && 'Ingresa tu correo para recibir un enlace de restablecimiento seguro.'}
          </p>
        </div>

        {/* Error / Success Notices */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border-2 border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div className="leading-snug font-medium">{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border-2 border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <div className="leading-snug font-medium">{successMsg}</div>
          </div>
        )}

        {/* Google Sign-in Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isSubmitting || loading}
          className="w-full py-3 px-4 bg-white hover:bg-[#FFF2DE] text-[#28243A] text-xs font-black rounded-2xl border-2 border-[#FFD65A]/60 transition-all shadow-xs flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-98 cursor-pointer"
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
          <div className="grow border-t-2 border-[#FFD65A]/40"></div>
          <span className="shrink mx-3 text-[10px] text-[#28243A]/60 uppercase tracking-wider font-black">
            o con correo y contraseña
          </span>
          <div className="grow border-t-2 border-[#FFD65A]/40"></div>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <>
              <div>
                <label className="text-xs font-black text-[#28243A] block mb-1">
                  Nombre visible
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ej. Alex Morales"
                    className="w-full bg-white border-2 border-[#FFD65A]/60 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-[#28243A] font-bold focus:border-[#FF936F] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-[#28243A] block mb-1">
                  Nombre de usuario único (@handle)
                </label>
                <div className="relative">
                  <AtSign className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="alexm (mínimo 3 letras o números)"
                    className="w-full bg-white border-2 border-[#FFD65A]/60 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-[#28243A] font-mono font-bold focus:border-[#FF936F] outline-none"
                  />
                </div>
                <span className="text-[10px] text-[#28243A]/60 mt-0.5 block">
                  Tus amigos te buscarán con este identificador único en la app.
                </span>
              </div>

              <div>
                <label className="text-xs font-black text-[#28243A] block mb-1">
                  Biografía o estado personal (opcional)
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Ej. Estudiante · Cuidando mi bienestar ✨"
                    className="w-full bg-white border-2 border-[#FFD65A]/60 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-[#28243A] font-medium focus:border-[#FF936F] outline-none"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-black text-[#28243A] block mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="w-full bg-white border-2 border-[#FFD65A]/60 rounded-2xl px-4 py-2.5 text-xs text-[#28243A] font-bold focus:border-[#FF936F] outline-none"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-black text-[#28243A]">
                  Contraseña
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#FF936F] hover:underline font-bold"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-white border-2 border-[#FFD65A]/60 rounded-2xl pl-10 pr-3 py-2.5 text-xs text-[#28243A] font-bold focus:border-[#FF936F] outline-none"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-[#FFD65A] via-[#FF936F] to-[#FF80B5] hover:scale-102 text-[#28243A] text-xs font-black rounded-2xl transition-all shadow-[0_4px_12px_rgba(255,147,111,0.35)] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Procesando...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Iniciar sesión con correo</span>
              </>
            ) : mode === 'register' ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Crear cuenta real</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Enviar correo de restablecimiento</span>
              </>
            )}
          </button>
        </form>

        {/* Switch between Login / Register */}
        <div className="text-center text-xs text-[#28243A]/80 pt-2 border-t border-[#FFD65A]/30">
          {mode === 'login' ? (
            <p>
              ¿No tienes una cuenta aún?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-[#FF936F] font-black hover:underline cursor-pointer"
              >
                Regístrate aquí
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta registrada?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-[#FF936F] font-black hover:underline cursor-pointer"
              >
                Inicia sesión
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
