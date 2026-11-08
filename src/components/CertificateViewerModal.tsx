import React, { useEffect } from 'react';
import { X, ShieldCheck, ExternalLink, Calendar, Award } from 'lucide-react';
import { type CredentialItem } from '../data/portfolioData';
import { sound } from '../utils/audio';
import { useLanguage } from '../context/LanguageContext';

interface CertificateViewerModalProps {
  credential: CredentialItem | null;
  onClose: () => void;
}

export const CertificateViewerModal: React.FC<CertificateViewerModalProps> = ({
  credential,
  onClose,
}) => {
  const { t, lang } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playClick(500);
        onClose();
      }
    };
    if (credential) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [credential, onClose]);

  if (!credential) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-[#141312] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#34d399]" />
            <span className="font-ui text-xs uppercase tracking-wider text-[#34d399] font-medium">
              {t.capabilities.modal.header}
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClick(500);
              onClose();
            }}
            className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#A8A29E] hover:text-white transition-all cursor-pointer"
            aria-label={t.capabilities.modal.close}
          >
            <X size={16} />
          </button>
        </div>

        {/* Certificate Badge Image Preview */}
        {credential.badgeImageUrl && (
          <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-white/10 bg-black/50 mb-6 group">
            <img
              src={credential.badgeImageUrl}
              alt={credential.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141312] via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-ui">
              <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[#D6B89A]">
                {credential.code}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[#34d399]">
                {credential.verificationState}
              </span>
            </div>
          </div>
        )}

        {/* Title & Issuer */}
        <div>
          <span className="font-ui text-xs uppercase tracking-wider text-[#D6B89A]">
            {credential.issuer}
          </span>
          <h3 className="font-editorial text-2xl sm:text-3xl text-[#F6F4EF] font-normal mt-1">
            {credential.title}
          </h3>
        </div>

        {/* Telemetry Grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs font-ui">
          <div>
            <span className="text-[#78716C] block">{t.capabilities.modal.issueDate}</span>
            <span className="text-[#F6F4EF] font-medium mt-0.5 block flex items-center gap-1.5">
              <Calendar size={13} className="text-[#D6B89A]" />
              <span>{credential.issueDate}</span>
            </span>
          </div>
          <div>
            <span className="text-[#78716C] block">{t.capabilities.modal.credentialId}</span>
            <span className="text-[#D6B89A] font-mono mt-0.5 block truncate">
              {credential.credentialId}
            </span>
          </div>
        </div>

        {/* Summary */}
        <p className="mt-5 font-sans text-sm text-[#D6D3D1] leading-relaxed">
          {credential.summary}
        </p>

        {/* Actions */}
        <div className="mt-8 pt-5 border-t border-white/[0.08] flex items-center justify-between">
          <button
            onClick={() => {
              sound.playClick(500);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-ui text-[#A8A29E] hover:text-white transition-colors cursor-pointer"
          >
            {t.capabilities.modal.close}
          </button>

          {credential.credentialUrl && (
            <a
              href={credential.credentialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F6F4EF] hover:bg-[#D6B89A] text-[#09090b] font-ui text-xs font-semibold tracking-wider transition-colors no-underline cursor-pointer"
            >
              <span>{t.capabilities.modal.verifyBtn}</span>
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

