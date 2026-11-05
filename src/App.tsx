/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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

const AppContent: React.FC = () => {
  const {
    activeTab,
    activeFullscreenDevice,
  } = useEmoti();

  // If Fullscreen Emoti-Bot or Emoti-Band is active, the real screen transforms directly into that device experience
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
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col text-[#28243A] font-sans selection:bg-[#FFD65A] selection:text-[#28243A]">
      {/* Real Application Header */}
      <Header />

      {/* Main Content Area - Native Mobile First, smoothly scaling on Tablet/Desktop */}
      <main className="flex-1 w-full max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-8">
        {renderCurrentView()}
      </main>

      {/* Real Mobile Bottom Navigation (Native App Tab Bar for mobile/tablet) */}
      <BottomNavigation />

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
