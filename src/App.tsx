import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RunningMarquee } from './components/RunningMarquee';
import { WorkFriezeSection } from './components/WorkFriezeSection';
import { CapabilitiesAtlasSection } from './components/CapabilitiesAtlasSection';
import { JourneySection } from './components/JourneySection';
import { ContactSection } from './components/ContactSection';
import { SectionTransition } from './components/SectionTransition';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomCursor } from './components/CustomCursor';
import { MonographSideRail } from './components/MonographSideRail';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { lang, toggleLang, t } = useLanguage();
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenAdmin = () => {
    if (isAuthenticated) {
      setShowAdminDashboard(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleAdminSuccess = () => {
    setIsAuthenticated(true);
    setShowAdminLogin(false);
    setShowAdminDashboard(true);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#F6F4EF] selection:bg-[#D6B89A]/30 selection:text-[#F6F4EF] overflow-x-clip transition-colors">
      {/* Precision Contextual Fluid Cursor */}
      <CustomCursor />

      {/* Persistent Monograph Chapter Indicator Rail (Desktop) */}
      <MonographSideRail />

      {/* 00. Floating Monograph Capsule Navigation */}
      <Navbar
        onNavigate={scrollToSection}
        lang={lang}
        onToggleLang={toggleLang}
        onOpenAdmin={handleOpenAdmin}
      />

      <main>
        {/* 01. Hero — Typography First */}
        <HeroSection
          onExploreWork={() => scrollToSection('work')}
          onContact={() => scrollToSection('contact')}
        />

        {/* Transition: Chapter 01 -> Chapter 02 */}
        <SectionTransition
          fromChapter="01"
          toChapter="02"
          fromTitle={t.transitions.t0102.fromTitle}
          toTitle={t.transitions.t0102.toTitle}
          indicatorText={t.transitions.t0102.indicator}
        />

        {/* 02. Selected Work — Frieze 3D Cover-Flow Exhibition */}
        <WorkFriezeSection />

        {/* Transition: Chapter 02 -> Chapter 03 */}
        <SectionTransition
          fromChapter="02"
          toChapter="03"
          fromTitle={t.transitions.t0203.fromTitle}
          toTitle={t.transitions.t0203.toTitle}
          indicatorText={t.transitions.t0203.indicator}
        />

        {/* 03. Capabilities & Credentials — Interactive Atlas & Archive */}
        <CapabilitiesAtlasSection />

        {/* Transition: Chapter 03 -> Chapter 04 */}
        <SectionTransition
          fromChapter="03"
          toChapter="04"
          fromTitle={t.transitions.t0304.fromTitle}
          toTitle={t.transitions.t0304.toTitle}
          indicatorText={t.transitions.t0304.indicator}
        />

        {/* 04. Journey & Progression Timeline */}
        <JourneySection />

        {/* Transition: Chapter 04 -> Chapter 05 */}
        <SectionTransition
          fromChapter="04"
          toChapter="05"
          fromTitle={t.transitions.t0405.fromTitle}
          toTitle={t.transitions.t0405.toTitle}
          indicatorText={t.transitions.t0405.indicator}
        />
      </main>

      {/* 05. Contact Collaboration Terminal & Colophon */}
      <ContactSection />

      {/* Administrative CMS Authentication Overlay */}
      {showAdminLogin && (
        <AdminLogin
          onSuccess={handleAdminSuccess}
          onClose={() => setShowAdminLogin(false)}
        />
      )}

      {/* Administrative CMS Dashboard */}
      {showAdminDashboard && (
        <AdminDashboard
          onClose={() => setShowAdminDashboard(false)}
        />
      )}
    </div>
  );
}
