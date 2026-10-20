import React from 'react';
import { useEmoti } from '../../context/EmotiContext';
import { 
  Bluetooth, 
  RotateCw, 
  BatteryMedium, 
  Bot, 
  Watch, 
  CheckCircle2, 
  AlertCircle,
  Wifi,
  Sparkles
} from 'lucide-react';

export const BluetoothPairing: React.FC = () => {
  const {
    devices,
    isBluetoothScanning,
    discoveredDevices,
    startBluetoothScan,
    connectDevice,
    disconnectDevice,
    areAllDevicesConnected,
    botName,
    triggerSparkBurst,
    showToast
  } = useEmoti();

  const handleScan = () => {
    startBluetoothScan();
    triggerSparkBurst();
  };

  const handleConnect = (id: 'emoti-bot' | 'emoti-band') => {
    connectDevice(id);
    triggerSparkBurst();
    showToast(`¡Dispositivo ${id === 'emoti-bot' ? botName : 'Emoti-Band'} conectado!`, 'success');
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFD65A]/50 shadow-sm space-y-4">
      {/* Header & Scan Button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#79B9F2]/25 text-[#1E568A] flex items-center justify-center font-black">
              <Bluetooth className="w-4 h-4 text-[#1E568A]" />
            </div>
            <h2 className="font-black text-base tracking-tight text-[#28243A]">
              Conexión Bluetooth BLE 5.3
            </h2>
          </div>
          <p className="text-xs text-[#28243A]/70 font-medium mt-0.5">
            Vinculación de baja latencia con respuesta hápitca y visual
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={isBluetoothScanning}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-black bg-gradient-to-r from-[#FFD65A] to-[#FF936F] text-[#28243A] shadow-xs hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isBluetoothScanning ? 'animate-spin text-[#28243A]' : ''}`} />
          <span>{isBluetoothScanning ? 'Escaneando BLE...' : 'Buscar dispositivos'}</span>
        </button>
      </div>

      {/* Scanning Radar state */}
      {isBluetoothScanning && (
        <div className="p-4 bg-[#FFF9F0] rounded-2xl border-2 border-dashed border-[#FF936F] flex items-center justify-center gap-3 text-xs text-[#28243A] font-bold animate-pulse">
          <div className="relative flex items-center justify-center">
            <span className="w-4 h-4 bg-[#FF936F] rounded-full animate-ping" />
            <span className="w-2.5 h-2.5 bg-[#FF936F] rounded-full absolute" />
          </div>
          <span>Buscando señales de hardware cercanas...</span>
        </div>
      )}

      {/* Ecosystem Ready Banner */}
      {areAllDevicesConnected && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#72D6B1]/25 border-2 border-[#72D6B1] text-xs text-[#1D6E50] shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-[#1D6E50] shrink-0" />
          <div className="flex-1">
            <span className="font-black block text-sm">¡Ecosistema EMOTI listo y sincronizado!</span>
            <span className="text-[11px] text-[#1D6E50]/90 font-semibold block">
              {botName} y tu Emoti-Band están conectados y sincronizando emociones y pulsos hápticos.
            </span>
          </div>
        </div>
      )}

      {/* Device List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Emoti-Bot Card */}
        <div
          className={`p-4 rounded-2xl border-2 transition-all ${
            devices.bot.connected
              ? 'bg-[#FFF9F0] border-[#B69AF5] shadow-xs'
              : 'bg-white border-[#FFD65A]/30'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black transition-colors shadow-xs ${
                  devices.bot.connected
                    ? 'bg-gradient-to-tr from-[#79B9F2] to-[#B69AF5] text-white'
                    : 'bg-[#FFF9F0] text-gray-400 border border-gray-200'
                }`}
              >
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-[#28243A]">{botName}</h4>
                <div className="flex items-center gap-1.5 text-xs font-bold mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      devices.bot.connected ? 'bg-[#72D6B1] animate-ping' : 'bg-gray-400'
                    }`}
                  />
                  <span className={devices.bot.connected ? 'text-[#1D6E50]' : 'text-gray-500'}>
                    {devices.bot.connected ? 'Conectado · OLED Activo' : 'Desconectado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Battery & RSSI */}
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#28243A]">
              <BatteryMedium className="w-4 h-4 text-[#1D6E50]" />
              <span>{devices.bot.battery}%</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#FFD65A]/20">
            <span className="text-[11px] font-bold text-[#28243A]/70">
              {devices.bot.connected ? 'Sincronizado' : 'En espera'}
            </span>
            {devices.bot.connected ? (
              <button
                onClick={() => disconnectDevice('emoti-bot')}
                className="text-xs px-3 py-1 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-bold border border-rose-200"
              >
                Desconectar
              </button>
            ) : (
              <button
                onClick={() => handleConnect('emoti-bot')}
                className="text-xs px-4 py-1.5 bg-[#28243A] text-white hover:bg-black rounded-xl transition-all font-bold shadow-xs active:scale-95"
              >
                Conectar
              </button>
            )}
          </div>
        </div>

        {/* Emoti-Band Card */}
        <div
          className={`p-4 rounded-2xl border-2 transition-all ${
            devices.band.connected
              ? 'bg-[#FFF9F0] border-[#72D6B1] shadow-xs'
              : 'bg-white border-[#FFD65A]/30'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black transition-colors shadow-xs ${
                  devices.band.connected
                    ? 'bg-gradient-to-tr from-[#72D6B1] to-[#79B9F2] text-[#1D6E50]'
                    : 'bg-[#FFF9F0] text-gray-400 border border-gray-200'
                }`}
              >
                <Watch className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-xs sm:text-sm text-[#28243A]">Emoti-Band</h4>
                <div className="flex items-center gap-1.5 text-xs font-bold mt-0.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      devices.band.connected ? 'bg-[#72D6B1] animate-ping' : 'bg-gray-400'
                    }`}
                  />
                  <span className={devices.band.connected ? 'text-[#1D6E50]' : 'text-gray-500'}>
                    {devices.band.connected ? 'Conectado · Háptico Activo' : 'Desconectado'}
                  </span>
                </div>
              </div>
            </div>

            {/* Battery & RSSI */}
            <div className="flex items-center gap-1 text-xs font-mono font-bold text-[#28243A]">
              <BatteryMedium className="w-4 h-4 text-[#1D6E50]" />
              <span>{devices.band.battery}%</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#FFD65A]/20">
            <span className="text-[11px] font-bold text-[#28243A]/70">
              {devices.band.connected ? 'Biometría continua' : 'En espera'}
            </span>
            {devices.band.connected ? (
              <button
                onClick={() => disconnectDevice('emoti-band')}
                className="text-xs px-3 py-1 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-bold border border-rose-200"
              >
                Desconectar
              </button>
            ) : (
              <button
                onClick={() => handleConnect('emoti-band')}
                className="text-xs px-4 py-1.5 bg-[#28243A] text-white hover:bg-black rounded-xl transition-all font-bold shadow-xs active:scale-95"
              >
                Conectar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Educational disclaimer */}
      <div className="text-xs text-[#28243A]/70 flex items-center gap-2 pt-1 font-medium">
        <AlertCircle className="w-4 h-4 text-[#FF936F] shrink-0" />
        <span>
          Simulación Bluetooth interactiva. El smartphone actúa como procesador central del ecosistema.
        </span>
      </div>
    </div>
  );
};
