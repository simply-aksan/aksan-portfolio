import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { VasariShelf3D, type ShelfMode } from './VasariShelf3D';
import { SkillDetailModal } from './SkillDetailModal';
import { CertificateViewerModal } from './CertificateViewerModal';
import {
  SKILL_NODES,
  type SkillNode,
  type CredentialItem,
} from '../data/portfolioData';
import { contentService } from '../services/contentService';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

export const CapabilitiesAtlasSection: React.FC = () => {
  const { t, lang } = useLanguage();
  const [viewMode, setViewMode] = useState<ShelfMode>('master');
  const [credentials, setCredentials] = useState<CredentialItem[]>(() => contentService.getCredentialsSync());
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [selectedCredential, setSelectedCredential] = useState<CredentialItem | null>(null);

  useEffect(() => {
    contentService.fetchCredentials().then((data) => {
      if (data && data.length > 0) setCredentials(data);
    });

    const handleUpdate = () => {
      contentService.fetchCredentials().then((data) => {
        if (data && data.length > 0) setCredentials(data);
      });
    };
    window.addEventListener('portfolio-data-updated', handleUpdate);
    return () => window.removeEventListener('portfolio-data-updated', handleUpdate);
  }, []);

  const handleModeSwitch = (newMode: ShelfMode) => {
    sound.playClick(700);
    setViewMode(newMode);
  };

  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-heading"
      className="relative scroll-mt-24 bg-[#07080a] min-h-screen lg:min-h-[100vh] flex flex-col justify-between pt-16 sm:pt-20 pb-8 px-4 sm:px-6 md:px-12 overflow-hidden select-none"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-radial from-[#D6B89A]/5 via-transparent to-transparent pointer-events-none" />

      {/* Editorial Chapter Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-[1360px] w-full z-20 shrink-0"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-white/[0.08] pb-3 sm:pb-4">
          <div>
            <p className="font-ui text-xs tracking-[0.2em] text-[#D6B89A] flex items-center gap-2 mb-1.5 uppercase">
              <Sparkles size={14} />
              <span>{t.capabilities.badge}</span>
            </p>
            <h2
              id="capabilities-heading"
              className="font-editorial text-2xl sm:text-3xl md:text-4xl font-normal leading-[1.08] tracking-[-0.02em] text-[#F6F4EF]"
            >
              {t.capabilities.headingPrefix}{' '}
              <span className="font-accent italic text-[#D6B89A]">
                {t.capabilities.headingItalic}
              </span>
              .
            </h2>
          </div>

          {/* View Mode Pill Selector */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-lg shadow-black/30 shrink-0">
            <button
              type="button"
              onClick={() => handleModeSwitch('master')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-ui transition-all duration-200 cursor-pointer outline-none focus:outline-none ${
                viewMode === 'master'
                  ? 'bg-[#F6F4EF] text-[#09090b] font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.18)]'
                  : 'text-[#A8A29E] hover:text-[#F6F4EF] hover:bg-white/[0.06]'
              }`}
            >
              {lang === 'id' ? 'Master (2)' : 'Master (2)'}
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('skills')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-ui transition-all duration-200 cursor-pointer outline-none focus:outline-none ${
                viewMode === 'skills'
                  ? 'bg-[#F6F4EF] text-[#09090b] font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.18)]'
                  : 'text-[#A8A29E] hover:text-[#F6F4EF] hover:bg-white/[0.06]'
              }`}
            >
              {lang === 'id' ? `Keahlian (${SKILL_NODES.length})` : `Skills (${SKILL_NODES.length})`}
            </button>
            <button
              type="button"
              onClick={() => handleModeSwitch('credentials')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-ui transition-all duration-200 cursor-pointer outline-none focus:outline-none ${
                viewMode === 'credentials'
                  ? 'bg-[#F6F4EF] text-[#09090b] font-semibold shadow-[0_2px_12px_rgba(255,255,255,0.18)]'
                  : 'text-[#A8A29E] hover:text-[#F6F4EF] hover:bg-white/[0.06]'
              }`}
            >
              {lang === 'id' ? `Sertifikasi (${credentials.length})` : `Credentials (${credentials.length})`}
            </button>
          </div>
        </div>
      </motion.div>

      {/* 3D Physical Shelf Experience (Occupies center, flexibly adapting to viewport height) */}
      <div className="relative mx-auto w-full max-w-[1440px] px-4 flex-1 flex flex-col justify-between my-auto overflow-hidden">
        <VasariShelf3D
          mode={viewMode}
          credentialsList={credentials}
          onModeChange={handleModeSwitch}
          onSelectSkill={(skill) => setSelectedSkill(skill)}
          onSelectCredential={(cred) => setSelectedCredential(cred)}
        />
      </div>

      {/* Skill Detail Modal */}
      <SkillDetailModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
      />

      {/* Certificate Viewer Modal */}
      <CertificateViewerModal
        credential={selectedCredential}
        onClose={() => setSelectedCredential(null)}
      />
    </section>
  );
};
