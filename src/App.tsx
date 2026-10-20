/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { EmotiProvider, useEmoti } from './context/EmotiContext';
import { Header } from './components/common/Header';
import { Toast } from './components/common/Toast';
import { SparkBurstAnimation } from './components/common/SparkBurstAnimation';
import { DevicesView } from './components/devices/DevicesView';
import { EmotiAppView } from './components/emotiapp/EmotiAppView';
import { HomeDashboard } from './components/emotiapp/HomeDashboard';
import { MyCircleView } from './components/circle/MyCircleView';
import { ProfileView } from './components/profile/ProfileView';
import { FullscreenBot } from './components/devices/FullscreenBot';
import { FullscreenBand } from './components/devices/FullscreenBand';
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { PhoneFrame } from './components/common/PhoneFrame';
import { 
  Bot, 
  Smartphone, 
  Columns2, 
  Maximize2, 
  Minimize2, 
  Radio
} from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    activeFullscreenDevice,
  } = useEmoti();

  const [useDeviceFrame, setUseDeviceFrame] = useState(true);

  // If Fullscreen Emoti-Bot or Emoti-Band is active, the entire viewport transforms into the device!
  if (activeFullscreenDevice === 'bot') {
    return (
      <>
        <FullscreenBot />
        <Toast />
        <SparkBurstAnimation />
      </>
    );
  }

  if (activeFullscreenDevice === 'band') {
    return (
      <>
        <FullscreenBand />
        <Toast />
        <SparkBurstAnimation />
      </>
    );
  }

  // Active view renderer
  const renderCurrentView = () => {
    switch (activeTab) {
      case 'home':
        return <HomeDashboard />;
      case 'devices':
        return <DevicesView />;
      case 'circle':
        return <MyCircleView />;
      case 'emotiapp':
        return <EmotiAppView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col text-[#292A30] font-sans">
      {/* Global Header */}
      <Header />

      {/* Presentation Bar / Utility Toolbar */}
      <div className="bg-white/80 border-b border-[#ECEDEF] px-3 sm:px-6 py-2">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-[#50545E]">
          {/* Left: View selector toggle */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#292A30] hidden sm:inline">Modo prototipo:</span>
            <div className="flex items-center bg-[#ECEDEF] p-0.5 rounded-xl">
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-white text-[#292A30] shadow-xs'
                    : 'text-[#50545E] hover:text-[#292A30]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Smartphone</span>
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition-all ${
                  viewMode === 'split'
                    ? 'bg-white text-[#292A30] shadow-xs'
                    : 'text-[#50545E] hover:text-[#292A30]'
                }`}
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Showroom Dividido (Bot + App)</span>
              </button>
            </div>
          </div>

          {/* Right: Quick Tab Switcher and Frame Toggle */}
          <div className="flex items-center gap-3">
            {viewMode === 'mobile' && (
              <button
                onClick={() => setUseDeviceFrame(!useDeviceFrame)}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#D6D8DC] hover:bg-[#F8F7F4] transition-colors"
                title={useDeviceFrame ? 'Modo pantalla completa' : 'Modo marco de teléfono'}
              >
                {useDeviceFrame ? (
                  <>
                    <Maximize2 className="w-3 h-3 text-[#50545E]" />
                    <span>Expandir pantalla</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3 h-3 text-[#50545E]" />
                    <span>Marco de teléfono</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center gap-1.5 text-[11px] text-[#7A7E89]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Multi-dispositivo en vivo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 py-6 px-3 sm:px-6 max-w-6xl w-full mx-auto">
        {/* Split Showroom Mode (Devices on Left, EmotiApp / Active on Right) */}
        {viewMode === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Column 1: Physical Devices Simulator */}
            <div className="lg:col-span-6 space-y-4">
              <div className="sticky top-20">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4F4275] bg-[#DCD5F5]/60 px-2 py-0.5 rounded-md">
                    Simulador de Hardware
                  </span>
                  <span className="text-xs text-[#7A7E89]">Reacción en tiempo real</span>
                </div>
                <DevicesView />
              </div>
            </div>

            {/* Column 2: Connected App Interface */}
            <div className="lg:col-span-6 space-y-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2D5A3C] bg-[#D9E8DE]/60 px-2 py-0.5 rounded-md">
                  {activeTab === 'home'
                    ? 'Inicio'
                    : activeTab === 'circle'
                    ? 'Mi Círculo'
                    : activeTab === 'profile'
                    ? 'Perfil'
                    : 'EmotiApp'}
                </span>
                <span className="text-xs text-[#7A7E89]">Sincronización Cloud</span>
              </div>
              {renderCurrentView()}
            </div>
          </div>
        ) : (
          /* Single Smartphone Simulator Mode */
          <div className="flex justify-center">
            {useDeviceFrame ? (
              <PhoneFrame>
                {renderCurrentView()}
              </PhoneFrame>
            ) : (
              <div className="max-w-2xl w-full">
                {renderCurrentView()}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Persistent Bottom Navigation on Smartphone mode */}
      {viewMode === 'mobile' && <BottomNavigation />}

      {/* Interactive Global Toast and Particles */}
      <Toast />
      <SparkBurstAnimation />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <EmotiProvider>
        <AppContent />
      </EmotiProvider>
    </AuthProvider>
  );
}
