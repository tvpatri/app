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
  } = useEmoti();

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#ECEDEF] shadow-xs space-y-4">
      {/* Header & Scan Button */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Bluetooth className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-sm tracking-tight text-[#292A30]">
              Conexión de dispositivos
            </h2>
          </div>
          <p className="text-xs text-[#50545E] mt-0.5">
            Simulador de vinculación Bluetooth BLE de baja latencia
          </p>
        </div>

        <button
          onClick={startBluetoothScan}
          disabled={isBluetoothScanning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#ECEDEF] hover:bg-[#DCD5F5]/60 text-[#292A30] transition-colors disabled:opacity-50"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isBluetoothScanning ? 'animate-spin text-blue-600' : ''}`} />
          <span>{isBluetoothScanning ? 'Buscando...' : 'Buscar dispositivos'}</span>
        </button>
      </div>

      {/* Scanning Radar state */}
      {isBluetoothScanning && (
        <div className="p-4 bg-[#F8F7F4] rounded-xl border border-dashed border-[#D6D8DC] flex items-center justify-center gap-3 text-xs text-[#50545E]">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 bg-blue-600 rounded-full animate-ping" />
            <span className="w-2 h-2 bg-blue-600 rounded-full absolute" />
          </div>
          <span>Buscando dispositivos cercanos...</span>
        </div>
      )}

      {/* Ecosystem Ready Banner */}
      {areAllDevicesConnected && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#D9E8DE]/60 border border-[#C2D8C9] text-xs text-[#2D5A3C]">
          <CheckCircle2 className="w-4 h-4 text-[#2D5A3C] shrink-0" />
          <div className="flex-1">
            <span className="font-semibold">Tu ecosistema Emoti está listo.</span>
            <span className="hidden sm:inline text-[11px] text-[#2D5A3C]/80 block">
              Emoti-Bot y Emoti-Band están sincronizados y respondiendo a tus emociones.
            </span>
          </div>
        </div>
      )}

      {/* Device List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Emoti-Bot Card */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            devices.bot.connected
              ? 'bg-[#F8F7F4] border-[#DCD5F5]'
              : 'bg-white border-[#ECEDEF]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  devices.bot.connected
                    ? 'bg-[#DCD5F5] text-[#4F4275]'
                    : 'bg-[#ECEDEF] text-[#7A7E89]'
                }`}
              >
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-[#292A30]">{botName}</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-[#50545E]">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      devices.bot.connected ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  />
                  <span>{devices.bot.connected ? 'Conectado' : 'Desconectado'}</span>
                </div>
              </div>
            </div>

            {/* Battery & RSSI */}
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#50545E]">
              <BatteryMedium className="w-3.5 h-3.5 text-gray-500" />
              <span>{devices.bot.battery}%</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#ECEDEF]/60">
            <span className="text-[10px] text-[#7A7E89]">
              {devices.bot.connected ? 'Sincronizado' : 'En reposo'}
            </span>
            {devices.bot.connected ? (
              <button
                onClick={() => disconnectDevice('emoti-bot')}
                className="text-xs px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
              >
                Desconectar
              </button>
            ) : (
              <button
                onClick={() => connectDevice('emoti-bot')}
                className="text-xs px-3 py-1 bg-[#292A30] text-white hover:bg-black rounded-lg transition-colors font-medium"
              >
                Conectar
              </button>
            )}
          </div>
        </div>

        {/* Emoti-Band Card */}
        <div
          className={`p-3.5 rounded-xl border transition-all ${
            devices.band.connected
              ? 'bg-[#F8F7F4] border-[#D9E8DE]'
              : 'bg-white border-[#ECEDEF]'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  devices.band.connected
                    ? 'bg-[#D9E8DE] text-[#2D5A3C]'
                    : 'bg-[#ECEDEF] text-[#7A7E89]'
                }`}
              >
                <Watch className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-[#292A30]">Emoti-Band</h4>
                <div className="flex items-center gap-1.5 text-[11px] text-[#50545E]">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      devices.band.connected ? 'bg-emerald-500' : 'bg-gray-400'
                    }`}
                  />
                  <span>{devices.band.connected ? 'Conectado' : 'Desconectado'}</span>
                </div>
              </div>
            </div>

            {/* Battery & RSSI */}
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#50545E]">
              <BatteryMedium className="w-3.5 h-3.5 text-gray-500" />
              <span>{devices.band.battery}%</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#ECEDEF]/60">
            <span className="text-[10px] text-[#7A7E89]">
              {devices.band.connected ? 'Biometría activa' : 'En reposo'}
            </span>
            {devices.band.connected ? (
              <button
                onClick={() => disconnectDevice('emoti-band')}
                className="text-xs px-2.5 py-1 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
              >
                Desconectar
              </button>
            ) : (
              <button
                onClick={() => connectDevice('emoti-band')}
                className="text-xs px-3 py-1 bg-[#292A30] text-white hover:bg-black rounded-lg transition-colors font-medium"
              >
                Conectar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Educational disclaimer */}
      <div className="text-[11px] text-[#7A7E89] flex items-center gap-1.5 pt-1">
        <AlertCircle className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span>
          Simulación Bluetooth interactiva. El smartphone actúa como procesador del ecosistema.
        </span>
      </div>
    </div>
  );
};
